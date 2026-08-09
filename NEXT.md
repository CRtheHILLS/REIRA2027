# NEXT

## Live

**https://reirasj.com** — TLS issued, `http://` 301s to `https://`.
Railway project `REIRA2027` (`bbaa9c3b-ab61-4bae-9e45-6d5764ea3995`),
service `reira-web`, production, Dockerfile builder, `PORT=8080`.

Verified on the real domain: every asset 200s with the right MIME and cache
lifetime (HTML no-cache, images 1 day, fonts 1 year immutable), unknown paths
404, and the unfurl tags are served to a logged-out request with a reachable
`og:image` (1200×630 JPEG, ~184 KB).

## Leftover: www.reirasj.com

Still fails TLS. Its CNAME points at `hcine7xl.up.railway.app` — the deleted
DOCUDOCU service — so nothing terminates the connection.

Fix in the dashboard, same place the apex was added: `reira-web` → Settings →
Networking → **Custom Domain** → `www.reirasj.com`, target port 8080. Railway
rewrites the CNAME because it is also the registrar. If www is not wanted at
all, delete the record instead — leaving it pointed at a dead service is the
one state worth avoiding.

**Not doable from the CLI.** Both tokens supplied so far are *project*
tokens: they deploy, read variables, and can mint the generated
`.up.railway.app` domain, but every custom-domain call returns
`Unauthorized`. An account token would work — that is a different page from
the project's token settings: profile menu → **Account Settings → Tokens**
(<https://railway.com/account/tokens>).

## Deploying a change

Push to `main`. The `REIRA2027` service is connected to the GitHub repo and
deploys on its own — no `railway up` needed.

`railway up` is what created the stray `reira-web` service in the first
place: the very first run happened while the project had no services at all,
so the CLI made one, and it sat there serving a second copy of the same
container on a generated domain until it was deleted. If a manual upload is
ever needed again, always pass `--service REIRA2027`.

`PORT=8080` is pinned as a service variable so the custom domain's target
port has something fixed to point at, rather than depending on Caddy's own
fallback.

## Once the link goes out

- Paste into KakaoTalk and check the card. Kakao caches the first one it sees
  per URL — flush at <https://developers.kakao.com/tool/clear/og>.
- Facebook and X keep their own caches with their own debuggers.
- Regenerate the card after any copy change: `npm run og`.

## Known cosmetic quirk

The lyricist credits grid is `auto-fit` with a 260px minimum, so at desktop
width six cards land in a four-column grid and the last row leaves two empty
cells. The container is `#141018`, so the gap reads as the FERMATA card
running wide rather than as a hole. It came that way in the export, and the
page body is deliberately byte-identical to `REIRA.html` — fix it in the
artifact (three columns) rather than here, or the next re-export conflicts.

## Content still to fill in

- `sitemap.xml` carries one URL and a hardcoded `lastmod`.
- The album block says "2027.03 · 기획중" — swap in real track and release
  data when it exists.
