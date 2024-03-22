FROM caddy

ADD Caddyfile /etc/caddy/Caddyfile
COPY build /html

EXPOSE 80