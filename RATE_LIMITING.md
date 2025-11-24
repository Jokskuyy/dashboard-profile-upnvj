# Rate Limiting Configuration

## Overview
Nginx rate limiting telah dikonfigurasi untuk melindungi aplikasi dari abuse dan DDoS attacks.

## Rate Limit Zones

### 1. General Zone (10 req/s)
- **Zone**: `general`
- **Rate**: 10 requests per second
- **Burst**: 20 requests
- **Applied to**: Homepage, dashboard pages, static assets

### 2. API Zone (5 req/s)
- **Zone**: `api`
- **Rate**: 5 requests per second
- **Burst**: 10 requests
- **Applied to**: `/dashboard-upnvj/api/*` endpoints

### 3. Login Zone (3 req/min)
- **Zone**: `login`
- **Rate**: 3 requests per minute
- **Burst**: 2 requests
- **Applied to**: `/dashboard-upnvj/login`, `/dashboard-upnvj/admin/login`

### 4. Connection Limit
- **Max connections per IP**: 10 concurrent connections

## Testing Rate Limits

### Test General Endpoint
```bash
# Should succeed (within rate limit)
for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\n" https://jejakiman.site/dashboard-upnvj/; done

# Should return 429 (exceeds rate limit)
for i in {1..30}; do curl -s -o /dev/null -w "%{http_code}\n" https://jejakiman.site/dashboard-upnvj/; done
```

### Test Login Endpoint
```bash
# Should succeed (3 requests per minute)
for i in {1..3}; do curl -s -o /dev/null -w "%{http_code}\n" https://jejakiman.site/dashboard-upnvj/login; done

# Should return 429 (exceeds rate limit)
for i in {1..5}; do curl -s -o /dev/null -w "%{http_code}\n" https://jejakiman.site/dashboard-upnvj/login; done
```

## Monitoring

### Check Rate Limit Logs
```bash
sudo tail -f /var/log/nginx/rate_limit.log
```

### Check Nginx Error Logs
```bash
sudo tail -f /var/log/nginx/error.log | grep limiting
```

### Check Access Logs for 429 Responses
```bash
sudo grep "429" /var/log/nginx/access.log | tail -20
```

## HTTP Response Headers

When rate limited, clients receive:
- **Status Code**: 429 Too Many Requests
- **Header**: `X-RateLimit-Limit: 5r/s` (for API endpoints)

## Adjusting Rate Limits

Edit `/etc/nginx/sites-available/dashboard-upnvj`:

```nginx
# Change rate limit values
limit_req_zone $binary_remote_addr zone=general:10m rate=20r/s;  # Increase to 20 req/s
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;      # Increase to 10 req/s
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;     # Increase to 5 req/min
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Whitelisting IPs

To whitelist specific IPs (e.g., monitoring services):

```nginx
geo $limit {
    default 1;
    10.0.0.0/8 0;           # Internal network
    192.168.1.100 0;        # Specific IP
}

map $limit $limit_key {
    0 "";
    1 $binary_remote_addr;
}

limit_req_zone $limit_key zone=general:10m rate=10r/s;
```

## Best Practices

1. **Monitor regularly**: Check logs for legitimate users being rate limited
2. **Adjust burst values**: Allow short spikes without blocking users
3. **Set appropriate limits**: Balance security with user experience
4. **Use different zones**: Apply stricter limits to sensitive endpoints
5. **Implement client-side retry**: Add exponential backoff in frontend

## Troubleshooting

### Users reporting "Too Many Requests"
1. Check if they're hitting burst limits
2. Verify their usage pattern in access logs
3. Consider increasing burst value or rate

### Rate limiting not working
1. Verify Nginx config: `sudo nginx -t`
2. Check if zones are defined in http context
3. Ensure location blocks have `limit_req` directive

### Performance issues
1. Monitor zone memory usage
2. Adjust zone size if needed (currently 10m)
3. Consider using Redis for distributed rate limiting
