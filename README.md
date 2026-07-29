# uaad-site

The new UAAD landing page: header, the "What's On" subway-line event
timeline, and footer. Pure static site — hosted free on GitHub Pages, no
Vercel, no database. Content (events) lives in this same repo as a JSON
file, edited through a lightweight `/admin` page that writes straight to
GitHub using your own access token.

## 1. Publish to GitHub

Use GitHub Desktop: **Add Local Repository** → point at this folder → when
prompted, create the repository → **Publish repository**.

Your repo must be **Public** for free GitHub Pages (Settings → General →
Danger Zone → Change visibility). Nothing secret lives in this repo, so
that's safe.

## 2. Turn on GitHub Pages

Repo → **Settings → Pages** → under "Build and deployment," set **Source**
to **GitHub Actions**. A push to `main` will now automatically build and
publish the site (see `.github/workflows/deploy.yml`).

## 3. Point the site at your own repo

Open `src/lib/githubConfig.ts` and change:

```ts
export const GITHUB_OWNER = "YOUR-GITHUB-USERNAME";
export const GITHUB_REPO = "uaad-site";
```

to your actual GitHub username/org and repo name, then commit + push. This
tells both the public page (reading events) and the admin page (writing
events) where to find `content/events.json` in your repo.

## 4. Create your admin access token

The `/admin` page needs a GitHub **fine-grained personal access token**
scoped to just this repo — this is the actual security boundary, so set it
up carefully:

1. GitHub → your profile photo → **Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token**
2. **Repository access**: "Only select repositories" → choose this repo
   only (never "All repositories")
3. **Permissions → Repository permissions → Contents**: set to
   **Read and write**. Leave everything else as "No access."
4. Set an **expiration** (90 days is reasonable) — you'll just generate a
   new one when it lapses
5. Generate, copy the token (starts with `github_pat_...`)

Go to `https://your-site-url/admin`, paste the token in. It's stored only
in your browser's local storage and is only ever sent to GitHub's API —
never committed to the repo, never sent anywhere else.

## 5. Add your first event

Once logged into `/admin`, fill in the form and hit **Add event**. This:

- uploads the cover image (if any) to `content/uploads/` in the repo
- reads, updates, and writes `content/events.json` back to the repo

The public homepage fetches `content/events.json` directly from GitHub on
every page load, so new events show up within about a minute (GitHub's raw
file CDN caches briefly) — no rebuild needed. Only *code* changes (editing
components, styling, etc.) need a git push + the Actions rebuild.

## Security notes

- The repo being public means anyone can **read** your code and content —
  it does **not** mean anyone can **write** to it. Only someone holding a
  valid access token can make changes.
- Scope every token to this one repo with Contents-only permission, and set
  an expiration. If a token is ever compromised, the damage is capped to
  this repo, and it self-expires.
- Never paste your token anywhere except the `/admin` login field on your
  own site.

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public page and
`http://localhost:3000/admin` for the dashboard (this works locally too,
since it just talks to GitHub's API directly).
