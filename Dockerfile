FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html robots.txt sitemap.xml /srv/
COPY assets /srv/assets
COPY vendor /srv/vendor

RUN caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
