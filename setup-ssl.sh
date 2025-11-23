#!/bin/bash

echo "🔍 Checking DNS propagation for jejakiman.site..."
echo ""

# Check if DNS resolves to correct IP
EXPECTED_IP="43.134.171.102"
ACTUAL_IP=$(dig +short jejakiman.site @8.8.8.8 | head -1)

if [ -z "$ACTUAL_IP" ]; then
    echo "❌ DNS belum propagate. Domain jejakiman.site belum resolve."
    echo ""
    echo "⏱️  Tunggu 5-30 menit dan coba lagi dengan:"
    echo "   ./setup-ssl.sh"
    echo ""
    echo "📝 Pastikan DNS records sudah diupdate:"
    echo "   Type: A | Name: @ | Content: 43.134.171.102"
    echo "   Type: A | Name: www | Content: 43.134.171.102"
    exit 1
fi

if [ "$ACTUAL_IP" != "$EXPECTED_IP" ]; then
    echo "⚠️  DNS resolve ke IP yang salah:"
    echo "   Expected: $EXPECTED_IP"
    echo "   Actual: $ACTUAL_IP"
    echo ""
    echo "Periksa DNS settings Anda dan tunggu propagasi."
    exit 1
fi

echo "✅ DNS sudah propagate! jejakiman.site → $ACTUAL_IP"
echo ""
echo "🔒 Installing Let's Encrypt SSL certificate..."
echo ""

# Install SSL with Certbot
sudo certbot --nginx \
    -d jejakiman.site \
    -d www.jejakiman.site \
    --non-interactive \
    --agree-tos \
    --email admin@jejakiman.site \
    --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SSL Certificate berhasil diinstall!"
    echo ""
    echo "✅ Website sekarang bisa diakses di:"
    echo "   🔒 https://jejakiman.site/dashboard-upnvj/"
    echo "   🔒 https://www.jejakiman.site/dashboard-upnvj/"
    echo ""
    echo "📋 Features:"
    echo "   ✓ HTTPS dengan trusted certificate"
    echo "   ✓ Auto-redirect HTTP → HTTPS"
    echo "   ✓ Auto-renewal setiap 90 hari"
    echo ""
    echo "🔍 Check certificate info:"
    echo "   sudo certbot certificates"
else
    echo ""
    echo "❌ SSL installation gagal. Periksa error di atas."
    echo ""
    echo "Troubleshooting:"
    echo "   1. Pastikan port 80 dan 443 terbuka (firewall)"
    echo "   2. Pastikan DNS sudah propagate"
    echo "   3. Cek Nginx config: sudo nginx -t"
fi
