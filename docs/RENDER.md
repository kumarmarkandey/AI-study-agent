# Deploying AI-Study-Companion to Render

This guide explains how to deploy the backend (Node/Express) and frontend (Vite/React) on Render and how to push the project to GitHub.

Prerequisites:
- A GitHub account and a GitHub repository to push this project to.
- A Render account.

1) Prepare the repository
- Ensure your local changes are committed. See Git steps below to push to GitHub.

2) Backend (Web Service)
- In Render: New -> Web Service -> Connect to GitHub and pick your repo.
- For "Root Directory" enter `backend`.
- Environment: `Node`.
- Build Command: (optional) `npm install` — Render will install automatically for Node services.
- Start Command: leave default (Render will run `npm start` which maps to `node server.js`).
- Set environment variables in Render's dashboard (Settings → Environment):
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `JWT_SECRET`, `PORT` (if needed)
- Optionally enable automatic deploys from the selected branch.

3) Frontend (Static Site)
- In Render: New -> Static Site -> Connect to GitHub and pick your repo.
- For "Root Directory" enter `frontend`.
- Build Command: `npm install && npm run build`.
- Publish Directory: `dist`.
- Optionally set environment variables used at build time.

4) Database
- This project uses MySQL. Render offers managed databases (create a MySQL instance and set credentials), or use an external DB.
- After creating the DB, set DB env vars in the backend service settings.

5) GitHub: push local repo (example)
```
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

6) Environment and secrets
- Never commit secrets to Git. Use `backend/.env.example` as a template.
- Configure secrets in Render's Environment settings for the backend service.

7) Verify
- After deployments finish, visit the service URLs Render provides and check:
  - Backend: `https://<your-backend>.onrender.com/` → should return the status JSON.
  - Frontend: `https://<your-frontend>.onrender.com/` → your site.

If you want, I can:
- Commit these changes locally and try to push to your GitHub remote (I will check remotes first).
- Add a `render.yaml` for Render's spec-based deploy (I can generate one once you confirm Render configuration preferences).
