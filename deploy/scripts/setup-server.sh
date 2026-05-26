#!/usr/bin/env bash
# =============================================================================
# SERVER SETUP SCRIPT — English Learning App
# =============================================================================
# Run this ONCE on a fresh Ubuntu 22.04 DigitalOcean Droplet
#
# Usage:
#   scp deploy/scripts/setup-server.sh root@157.230.37.27:/tmp/
#   ssh root@157.230.37.27 'bash /tmp/setup-server.sh'
# =============================================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────────────────────
DOMAIN="learnenglish1.me"
DEPLOY_USER="deploy"
APP_DIR="/opt/english-app"

echo "============================================="
echo "  English Learning App — Server Setup"
echo "  Domain: ${DOMAIN}"
echo "============================================="

# ── Step 1: System Update ────────────────────────────────────────────────────
echo ""
echo "[1/8] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    htop \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release

# ── Step 2: Create deploy user ──────────────────────────────────────────────
echo ""
echo "[2/8] Creating deploy user..."
if id "${DEPLOY_USER}" &>/dev/null; then
    echo "  User '${DEPLOY_USER}' already exists, skipping."
else
    adduser --disabled-password --gecos "" ${DEPLOY_USER}
    usermod -aG sudo ${DEPLOY_USER}
    # Allow sudo without password for deploy user
    echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${DEPLOY_USER}

    # Copy SSH keys from root to deploy user
    mkdir -p /home/${DEPLOY_USER}/.ssh
    cp /root/.ssh/authorized_keys /home/${DEPLOY_USER}/.ssh/
    chown -R ${DEPLOY_USER}:${DEPLOY_USER} /home/${DEPLOY_USER}/.ssh
    chmod 700 /home/${DEPLOY_USER}/.ssh
    chmod 600 /home/${DEPLOY_USER}/.ssh/authorized_keys
    echo "  User '${DEPLOY_USER}' created with SSH access."
fi

# ── Step 3: Configure Firewall (UFW) ────────────────────────────────────────
echo ""
echo "[3/8] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
echo "  Firewall enabled: SSH(22), HTTP(80), HTTPS(443)"

# ── Step 4: Install Docker + Docker Compose ─────────────────────────────────
echo ""
echo "[4/8] Installing Docker..."
if command -v docker &>/dev/null; then
    echo "  Docker already installed: $(docker --version)"
else
    # Add Docker official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    # Add Docker repo
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Add deploy user to docker group (run docker without sudo)
    usermod -aG docker ${DEPLOY_USER}

    systemctl enable docker
    systemctl start docker
    echo "  Docker installed: $(docker --version)"
fi

# ── Step 5: Install Nginx ────────────────────────────────────────────────────
echo ""
echo "[5/8] Installing Nginx..."
if command -v nginx &>/dev/null; then
    echo "  Nginx already installed: $(nginx -v 2>&1)"
else
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx

    # Remove default site
    rm -f /etc/nginx/sites-enabled/default
    echo "  Nginx installed and default site removed."
fi

# ── Step 6: Install Certbot (Let's Encrypt SSL) ─────────────────────────────
echo ""
echo "[6/8] Installing Certbot..."
if command -v certbot &>/dev/null; then
    echo "  Certbot already installed: $(certbot --version 2>&1)"
else
    apt-get install -y certbot python3-certbot-nginx
    echo "  Certbot installed."
fi

# ── Step 7: Create application directory ─────────────────────────────────────
echo ""
echo "[7/8] Creating application directory..."
mkdir -p ${APP_DIR}
chown ${DEPLOY_USER}:${DEPLOY_USER} ${APP_DIR}
echo "  Directory created: ${APP_DIR}"

# ── Step 8: Configure fail2ban ───────────────────────────────────────────────
echo ""
echo "[8/8] Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3

[nginx-http-auth]
enabled = true
EOF

systemctl enable fail2ban
systemctl restart fail2ban
echo "  fail2ban configured (SSH brute-force protection)."

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================="
echo "  ✅ Server Setup Complete!"
echo "============================================="
echo ""
echo "  Next steps:"
echo "  1. Configure DNS: Point ${DOMAIN} A record → $(curl -s ifconfig.me)"
echo "  2. Copy Nginx config:"
echo "     scp deploy/nginx/${DOMAIN}.conf root@$(curl -s ifconfig.me):/etc/nginx/sites-available/"
echo "     ssh root@$(curl -s ifconfig.me) 'ln -sf /etc/nginx/sites-available/${DOMAIN}.conf /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx'"
echo "  3. Get SSL certificate:"
echo "     ssh root@$(curl -s ifconfig.me) 'certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m your-email@example.com'"
echo "  4. Deploy the app using deploy.sh"
echo ""
echo "  SSH as deploy user: ssh ${DEPLOY_USER}@$(curl -s ifconfig.me)"
echo "  App directory: ${APP_DIR}"
echo "============================================="
