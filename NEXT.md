# NEXT

## Live

**https://reirasj.com** — TLS issued, `http://` 301s to `https://`,
`www.` 301s to the apex.
Railway project `REIRA2027` (`bbaa9c3b-ab61-4bae-9e45-6d5764ea3995`),
service `reira-web`, production, Dockerfile builder, `PORT=8080`.

Verified on the real domain: every asset 200s with the right MIME and cache
lifetime (HTML no-cache, images 1 day, fonts 1 year immutable), unknown paths
404, and the unfurl tags are served to a logged-out request with a reachable
`og:image` (1200×630 JPEG, ~184 KB).

`www.reirasj.com` is attached too, and Caddy 301s it to the apex so one host
stays canonical.

## Reaching the Railway API when the CLI refuses

`railway domain <custom domain>` returns `Unauthorized` under a project
token, which reads like a permissions wall. It is not one — the same
operation succeeds as a raw GraphQL call with the same token:

```powershell
$body = @{
  query = 'mutation M($input: CustomDomainCreateInput!) { customDomainCreate(input: $input) { id domain targetPort } }'
  variables = @{ input = @{
    domain = "www.reirasj.com"
    projectId = "bbaa9c3b-ab61-4bae-9e45-6d5764ea3995"
    environmentId = "483642f9-94fe-4879-8f03-1b9fa146b58d"
    serviceId = "17506b0b-ae92-4594-bea7-346917847807"
    targetPort = 8080
  } }
} | ConvertTo-Json -Depth 8
Invoke-RestMethod -Uri "https://backboard.railway.com/graphql/v2" -Method Post `
  -Headers @{"Project-Access-Token" = $env:RAILWAY_TOKEN} `
  -ContentType "application/json" -Body $body
```

Worth remembering before asking for a wider token: the CLI's failure is not
proof the token lacks the right. What genuinely is out of reach is anything
workspace-scoped — `railwayDomainDnsRecords` and friends answer
`Not Authorized`, since DNS belongs to the workspace, not the project.
Workspace `3a22a5a5-b5ee-4e76-8efa-4c6d89004be4`
("bravomylife-lab's Projects").

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
