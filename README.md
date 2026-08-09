# REIRA2027 — reirasj.com

Official site for the K-POP ballad artist and lyricist **REIRA (레이라)** —
CRtheHILLS' first artist launch, 2027.

Live: <https://reira-web-production.up.railway.app>
(`reirasj.com` pending — see [NEXT.md](NEXT.md))

A single static page. No build step, no framework runtime to compile — the
HTML ships as-is and Caddy serves it.

## Layout

```
index.html              the whole page (markup + inline styles + <helmet> block)
assets/js/dc-runtime.js declarative-components runtime: resolves <x-dc>,
                        <helmet>, and the style-hover="…" attributes
assets/fonts/           subsetted Archivo / Bodoni Moda + variable Pretendard
assets/img/             photography, favicon
vendor/                 React 18.3.1 UMD, pinned (carried by the runtime)
Caddyfile               static server config (cache headers, compression)
Dockerfile              caddy:2-alpine + the files above
railway.json            tells Railway to build from the Dockerfile
```

`index.html` was recovered from a Claude artifact bundle: assets were extracted
from the bundle manifest, given readable filenames, and the uuid references
rewritten to relative paths.

## Run it locally

Any static server works, as long as it serves from the repo root:

```bash
npx serve .          # or: python -m http.server 8080
```

Opening `index.html` from the filesystem works too — every path is relative.

## Deploy

Railway builds the `Dockerfile` and runs Caddy on `$PORT`, pinned to 8080 as
a service variable so the custom-domain target port has something stable to
point at.

```bash
$env:RAILWAY_TOKEN = "<project token>"
railway up --ci --service reira-web
```

A project token is enough to deploy and read variables. It is **not** enough
to manage services or domains — those calls return `Unauthorized` and need
the dashboard or an account token.

The GitHub repo is not wired to the service yet, so pushing to `main` does
not deploy on its own; run `railway up` after pushing. Connecting the repo in
the dashboard (Settings → Source) turns pushes into deploys.
