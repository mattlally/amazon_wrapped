# Quick Start Checklist

Follow these steps in order. Check off each one as you complete it.

## ✅ Pre-Flight Check

- [ ] Node.js is installed (run `node --version` in terminal - should show a version number)
- [ ] You have a GitHub account
- [ ] Cursor is open with this project folder

## ✅ Step 1: Install Everything

1. Open terminal in Cursor: **Terminal** → **New Terminal** (or press `Ctrl + ~` / `Cmd + ~`)
2. Type: `npm install`
3. Press Enter
4. Wait for it to finish (2-5 minutes)
5. ✅ Done when you see "added X packages"

## ✅ Step 2: Test Locally

1. In the same terminal, type: `npm run dev`
2. Press Enter
3. Wait for "Local: http://localhost:5173/" message
4. Open your browser and go to: `http://localhost:5173`
5. ✅ You should see the upload page!
6. (To stop: Press `Ctrl + C` or `Cmd + C` in terminal)

## ✅ Step 3: Set Up GitHub

1. Go to github.com and create a new repository
   - Name it: `amazon-wrapped-web` (or whatever you want)
   - Make it **Public**
   - Don't initialize with README
2. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/amazon-wrapped-web.git`)
3. In Cursor, open `vite.config.ts`
4. Find line 9 and replace `amazon-wrapped-web` with YOUR repository name
5. Save the file

## ✅ Step 4: Connect to GitHub

In the terminal, run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

(Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values)

If asked for password, use a GitHub Personal Access Token (see BEGINNER_GUIDE.md for how to create one).

## ✅ Step 5: Deploy

1. On GitHub.com, go to your repository
2. Click **Settings** → **Pages**
3. Under "Source", select **"GitHub Actions"**
4. Save
5. Go to **Actions** tab
6. Wait 5-10 minutes for deployment to complete
7. ✅ Your site is live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 🆘 Stuck?

Read the detailed [BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md) - it explains everything in detail!

