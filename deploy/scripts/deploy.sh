#!/usr/bin/env bash
# =============================================================================
# DEPLOY SCRIPT — English Learning App
# =============================================================================
# Builds Docker images locally, pushes to Docker Hub, then SSH into the
# Droplet to pull and restart containers. Run from project root on your
# local machine (Git Bash / WSL / macOS Terminal).
#
# Usage:
#   bash deploy/scripts/deploy.sh              # Deploy ALL (client + server)
#   bash deploy/scripts/deploy.sh client       # Deploy frontend only
#   bash deploy/scripts/deploy.sh server       # Deploy backend only
#   bash deploy/scripts/deploy.sh --rollback   # Rollback to previous version
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
DOCKERHUB_USER="khanhtaduy2k5"
SERVER_IP="157.230.37.27"
SSH_USER="deploy"
APP_DIR="/opt/english-app"
DOMAIN="learnenglish1.me"

CLIENT_IMAGE="${DOCKERHUB_USER}/english-client"
SERVER_IMAGE="${DOCKERHUB_USER}/english-server"

# Version tag (timestamp-based)
VERSION=$(date +%Y%m%d-%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── Helper Functions ─────────────────────────────────────────────────────────
log_info()  { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_docker() {
    if ! command -v docker &>/dev/null; then
        log_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi
    # Check Docker Hub login
    if ! docker info 2>/dev/null | grep -q "Username: ${DOCKERHUB_USER}"; then
        log_warn "Not logged into Docker Hub. Logging in..."
        docker login -u "${DOCKERHUB_USER}"
    fi
}

# ── Build Functions ──────────────────────────────────────────────────────────
build_client() {
    log_info "Building frontend image: ${CLIENT_IMAGE}:${VERSION}"
    docker build \
        --build-arg NEXT_PUBLIC_API_BASE_URL=https://${DOMAIN} \
        -t "${CLIENT_IMAGE}:${VERSION}" \
        -t "${CLIENT_IMAGE}:latest" \
        ./client
    log_ok "Frontend image built successfully."
}

build_server() {
    log_info "Building backend image: ${SERVER_IMAGE}:${VERSION}"
    docker build \
        -t "${SERVER_IMAGE}:${VERSION}" \
        -t "${SERVER_IMAGE}:latest" \
        ./server
    log_ok "Backend image built successfully."
}

# ── Push Functions ───────────────────────────────────────────────────────────
push_client() {
    log_info "Pushing frontend image to Docker Hub..."
    docker push "${CLIENT_IMAGE}:${VERSION}"
    docker push "${CLIENT_IMAGE}:latest"
    log_ok "Frontend image pushed."
}

push_server() {
    log_info "Pushing backend image to Docker Hub..."
    docker push "${SERVER_IMAGE}:${VERSION}"
    docker push "${SERVER_IMAGE}:latest"
    log_ok "Backend image pushed."
}

# ── Remote Deploy ────────────────────────────────────────────────────────────
remote_deploy() {
    log_info "Deploying on server ${SERVER_IP}..."

    log_info "Syncing docker-compose.prod.yml to VPS..."
    scp docker-compose.prod.yml "${SSH_USER}@${SERVER_IP}:${APP_DIR}/docker-compose.prod.yml"

    ssh -o StrictHostKeyChecking=accept-new "${SSH_USER}@${SERVER_IP}" bash <<'REMOTE_SCRIPT'
        set -euo pipefail
        APP_DIR="/opt/english-app"
        cd "${APP_DIR}"

        echo ">> Pulling latest images..."
        docker compose -f docker-compose.prod.yml pull

        echo ">> Restarting containers..."
        docker compose -f docker-compose.prod.yml up -d --remove-orphans

        echo ">> Cleaning up old images..."
        docker image prune -f

        echo ">> Container status:"
        docker compose -f docker-compose.prod.yml ps

        echo ">> Waiting for health check (30s)..."
        sleep 30

        # Health check
        if curl -sf http://127.0.0.1:8080/api/health > /dev/null 2>&1; then
            echo ">> ✅ Backend health check: PASSED"
        else
            echo ">> ❌ Backend health check: FAILED"
            echo ">> Checking logs..."
            docker compose -f docker-compose.prod.yml logs --tail=20 server
            exit 1
        fi

        if curl -sf http://127.0.0.1:3000 > /dev/null 2>&1; then
            echo ">> ✅ Frontend health check: PASSED"
        else
            echo ">> ❌ Frontend health check: FAILED"
            echo ">> Checking logs..."
            docker compose -f docker-compose.prod.yml logs --tail=20 frontend
            exit 1
        fi
REMOTE_SCRIPT

    log_ok "Deployment complete!"
}

# ── Rollback ─────────────────────────────────────────────────────────────────
rollback() {
    log_warn "Rolling back to previous version..."

    ssh "${SSH_USER}@${SERVER_IP}" bash <<'REMOTE_SCRIPT'
        set -euo pipefail
        APP_DIR="/opt/english-app"
        cd "${APP_DIR}"

        echo ">> Current images:"
        docker compose -f docker-compose.prod.yml images

        echo ">> Rolling back (using previous local images)..."
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml up -d

        echo ">> Container status after rollback:"
        docker compose -f docker-compose.prod.yml ps
REMOTE_SCRIPT

    log_ok "Rollback complete."
}

# ── Main ─────────────────────────────────────────────────────────────────────
main() {
    local target="${1:-all}"

    echo ""
    echo "============================================="
    echo "  🚀 Deploy English Learning App"
    echo "  Version: ${VERSION}"
    echo "  Target:  ${target}"
    echo "============================================="
    echo ""

    # Handle rollback
    if [[ "${target}" == "--rollback" ]]; then
        rollback
        exit 0
    fi

    # Pre-flight checks
    check_docker

    # Check we're in the project root
    if [[ ! -f "docker-compose.prod.yml" ]]; then
        log_error "docker-compose.prod.yml not found. Run this script from the project root."
        exit 1
    fi

    case "${target}" in
        all)
            build_client
            build_server
            push_client
            push_server
            ;;
        client)
            build_client
            push_client
            ;;
        server)
            build_server
            push_server
            ;;
        *)
            log_error "Unknown target: ${target}"
            echo "Usage: $0 [all|client|server|--rollback]"
            exit 1
            ;;
    esac

    remote_deploy

    echo ""
    echo "============================================="
    echo "  ✅ Deployment Successful!"
    echo "  Version: ${VERSION}"
    echo "  URL:     https://${DOMAIN}"
    echo "  API:     https://${DOMAIN}/api/health"
    echo "============================================="
}

main "$@"
