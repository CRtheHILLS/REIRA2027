# NEXT

## Blocked on credentials

1. **Push to GitHub** — `origin` is set to `https://github.com/CRtheHILLS/REIRA2027.git`
   and the repo is reachable but empty. The push needs auth; nothing is
   cached on this machine and `gh` is not installed. Either:
   - a PAT with `repo` scope, or
   - run `git push -u origin main` once yourself so Git Credential Manager
     stores the login.

2. **Railway** — the CLI (v4.31.0) is installed but reports `Unauthorized`.
   With a project token:
   ```
   $env:RAILWAY_TOKEN = "<token>"
   railway link          # pick the REIRA2027 project
   railway up
   ```
   `railway.json` already pins the Dockerfile builder, so the service needs
   no build configuration in the dashboard.

3. **Domain** — attach `reirasj.com` in Railway → Settings → Networking, then
   point the registrar's CNAME at the generated `*.up.railway.app` host.

## After the first deploy

- Confirm the unfurl: paste `https://reirasj.com` into KakaoTalk. If a stale
  card shows, flush it at <https://developers.kakao.com/tool/clear/og>.
  Facebook/X have their own debuggers.
- Verify `og:image` is reachable logged-out:
  `curl -I https://reirasj.com/assets/img/og-cover.jpg` → 200, `image/jpeg`.
- The page was checked statically (all 17 local references resolve, no orphan
  assets) but has **not** been opened in a browser yet — worth a real
  look at the hero marquee, the sticky header, and the `style-hover` states
  the `dc-runtime` wires up.

## Content still to fill in

- `sitemap.xml` has a single URL and a hardcoded `lastmod` — update on release.
- The album section says "2027.03 · 기획중". Swap in real track/release data
  when it exists.
