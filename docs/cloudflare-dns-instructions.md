# Cloudflare DNS & Configuration Setup Guide

Follow these steps to configure Cloudflare for `learnenglish1.me`.

## 1. Configure Cloudflare DNS
1. Log in to your **Cloudflare Dashboard**.
2. Click **Add site** and enter `learnenglish1.me`. Select the Free plan.
3. Cloudflare will scan your existing DNS records.
4. Go to **DNS > Records** and add/verify the following A records:
   - **Type**: `A`, **Name**: `@` (or `learnenglish1.me`), **Content**: `157.230.37.27` (your VPS IP), **Proxy status**: 🟠 **Proxied** (Enabled).
   - **Type**: `CNAME`, **Name**: `www`, **Content**: `learnenglish1.me`, **Proxy status**: 🟠 **Proxied** (Enabled).
5. Copy the Cloudflare nameservers provided and update them at your domain registrar (e.g., GoDaddy, Namecheap).

## 2. SSL/TLS Configuration
1. Go to **SSL/TLS > Overview**.
2. Set the encryption mode to **Full (strict)**.
   > [!IMPORTANT]
   > "Full (strict)" requires a valid SSL certificate installed on your Nginx server. Since the VPS is already running Certbot (Let's Encrypt), this ensures end-to-end security.
3. Go to **SSL/TLS > Edge Certificates**:
   - Enable **Always Use HTTPS** to automatically redirect HTTP traffic to HTTPS.
   - Enable **Opportunistic Encryption** and **Automatic HTTPS Rewrites**.

## 3. Caching Rules for Next.js
To save bandwidth and improve performance, configure Cloudflare to cache static frontend bundle assets.
1. Go to **Caching > Cache Rules**.
2. Click **Create rule**.
3. **Rule Name**: `Cache Next.js Static Assets`.
4. **Field**: `URI Path`, **Operator**: `starts with`, **Value**: `/_next/static/`.
5. Under **Cache eligibility**, select **Eligible for cache**.
6. Under **Edge TTL**, set **Respect origin headers** (since our Nginx configuration already sets `Cache-Control: public, immutable, max-age=31536000`).

## 4. Security & DDoS Protection (WAF)
To protect your auth routes against credential stuffing:
1. Go to **Security > WAF > Rate limiting rules**.
2. Click **Create rule**.
3. **Rule Name**: `Limit Auth Attempts`.
4. **Expression**: `(http.request.uri.path startswith "/api/auth/")`.
5. Under **Action**, select **Block** or **Rate Limit**:
   - **Rate**: e.g., 20 requests per 10 seconds.
