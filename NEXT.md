# NEXT

## Live now

- **https://reira-web-production.up.railway.app** — deployed and verified.
- Railway project `REIRA2027` (`bbaa9c3b-ab61-4bae-9e45-6d5764ea3995`),
  service `reira-web`, environment `production`, Dockerfile builder.

## The one blocker: reirasj.com

The domain is bought through Railway but is **still attached to the old
`DOCUDOCU` project**, so Railway refuses to add it here:

> Domain is in use by service "DOCUDOCU" in project "DOCUDOCU" (production)

A domain can only point at one service, so it has to be released before it
can be claimed. In the dashboard:

1. `DOCUDOCU` → production → the service holding the domain → **Settings →
   Networking** → the `reirasj.com` custom domain → **Remove**.
2. `REIRA2027` → `reira-web` → **Settings → Networking → Custom Domain** →
   `reirasj.com`, **target port 8080**.
3. Repeat for `www.reirasj.com` if you want the www form to resolve.

Because Railway is the registrar, DNS is configured automatically — no
records to copy into a registrar. TLS is issued within a few minutes.

The CLI cannot do step 1 or 2: the project token deploys and reads
variables, but every domain and service management call returns
`Unauthorized`. That needs the dashboard, or an account token from
<https://railway.com/account/tokens>.

Nothing in the repo has to change when the domain moves — `og:image`,
`canonical` and the sitemap already point at `https://reirasj.com/`.

## Once the domain is attached

- Paste the link into KakaoTalk to check the unfurl. Kakao caches the first
  card it sees per URL; flush at <https://developers.kakao.com/tool/clear/og>.
- Confirm the scraper can reach the image logged-out:
  `curl -I https://reirasj.com/assets/img/og-cover.jpg` → `200`, `image/jpeg`.

## Verified so far

- All 17 local references in `index.html` resolve; no orphaned assets.
- Page body is byte-identical to the final `REIRA.html` export.
- Full-page render in headless Chromium: zero failed resource loads, the
  `dc-runtime` consumes every `<helmet>`/`<x-dc>` element, fonts and both
  photographs load.
- Response headers: `text/html` no-cache, images 1 day, fonts 1 year
  immutable, unknown paths 404.

## Known cosmetic quirk

The lyricist credits grid is `auto-fit` with a 260px minimum, so at desktop
width six cards land in a four-column grid and the last row leaves two empty
cells. The grid container is `#141018`, so the gap reads as the FERMATA card
running wide rather than as a hole. It came that way in the export and the
body is deliberately kept byte-identical to it — worth a decision next time
the page is re-exported rather than patched here, since a patch would show
up as a conflict against the next export.

## Content still to fill in

- `sitemap.xml` carries one URL and a hardcoded `lastmod`.
- The album block says "2027.03 · 기획중" — swap in real track and release
  data when it exists.
