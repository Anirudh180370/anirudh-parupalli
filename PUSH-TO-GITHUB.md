# 🚀 How to push this portfolio to Anirudh's GitHub

The repo is fully prepared — branch `main`, all files committed as Anirudh, remote already pointing to `https://github.com/Anirudh180370/anirudh-parupalli.git`. You just need to:

1. Create the empty repo on GitHub
2. Push
3. Enable GitHub Pages

---

## Step 1 — Create the empty repo on GitHub

Sign in to **Anirudh's** GitHub account (`Anirudh180370`), then go to:

👉 **https://github.com/new**

Fill in:

| Field | Value |
|-------|-------|
| Repository name | `anirudh-parupalli` |
| Description | `Personal portfolio — Founder · Author · Researcher` |
| Public/Private | **Public** (required for free GitHub Pages) |
| Initialize with README? | **NO** — leave all checkboxes unchecked |

Click **Create repository**.

---

## Step 2 — Push from Terminal

Open Terminal and paste these three commands one at a time:

```bash
cd "/Users/rakshithch/Desktop/Anirudh/Anirudh Portfolio"

# Remove any leftover lock files from initial setup (safe; they're empty)
rm -f .git/index.lock .git/HEAD.lock

# Stage and commit the deployment instructions, then push
git add PUSH-TO-GITHUB.md && git commit -m "Add deployment instructions"
git push -u origin main
```

If GitHub asks for authentication, you have two clean options:

**Option A — GitHub CLI (cleanest)**
```bash
brew install gh   # if not installed
gh auth login     # follow the browser flow with Anirudh's account
git push -u origin main
```

**Option B — Personal Access Token**
1. Go to https://github.com/settings/tokens (signed in as Anirudh)
2. Generate new token (classic) → check `repo` scope → copy the token
3. When git asks for password, paste the token (NOT his GitHub password)

---

## Step 3 — Enable GitHub Pages

After the push succeeds, go to the repo settings:

👉 **https://github.com/Anirudh180370/anirudh-parupalli/settings/pages**

Under **Build and deployment**:

| Setting | Value |
|---------|-------|
| Source | **Deploy from a branch** |
| Branch | `main` |
| Folder | `/ (root)` |

Click **Save**. Wait ~60 seconds for the first deploy.

---

## 🎉 Live URL

```
https://anirudh180370.github.io/anirudh-parupalli/
```

The first deploy takes 1–2 minutes. After that, every push to `main` redeploys automatically.

---

## Future updates

To update the site later:

```bash
cd "/Users/rakshithch/Desktop/Anirudh/Anirudh Portfolio"
# ... edit files ...
git add .
git commit -m "Update: <what you changed>"
git push
```
