# Complete Beginner's Guide to Amazon Wrapped

This guide is written for people with **zero coding experience**. Every step is explained in simple terms.

## Table of Contents
1. [What You Need](#what-you-need)
2. [Understanding the Basics](#understanding-the-basics)
3. [Step 1: Install Dependencies](#step-1-install-dependencies)
4. [Step 2: Test the App Locally](#step-2-test-the-app-locally)
5. [Step 3: Set Up GitHub](#step-3-set-up-github)
6. [Step 4: Deploy to GitHub Pages](#step-4-deploy-to-github-pages)
7. [Troubleshooting](#troubleshooting)

---

## What You Need

Before starting, make sure you have:

1. **Node.js installed** - This is a program that lets you run JavaScript code on your computer
   - Check if you have it: Open Cursor's terminal (see below) and type: `node --version`
   - If you see a version number (like `v20.10.0`), you're good!
   - If you get an error, download it from: https://nodejs.org/ (get the LTS version)
   - After installing, close and reopen Cursor

2. **A GitHub account** - This is where we'll host your website for free
   - Sign up at: https://github.com/signup (it's free)

3. **Cursor** - You're already using this! ✅

---

## Understanding the Basics

### What is npm?
**npm** stands for "Node Package Manager." Think of it like an app store for code. When you run `npm install`, you're downloading all the code libraries (called "packages") that this project needs to work.

### What is the Terminal?
The **terminal** (also called "command line" or "console") is a text-based way to give commands to your computer. Instead of clicking buttons, you type commands.

### How to Open the Terminal in Cursor
1. Look at the top menu in Cursor
2. Click **Terminal** → **New Terminal**
   - OR press `Ctrl + ~` (Windows/Linux) or `Cmd + ~` (Mac)
3. You'll see a black or white box at the bottom of Cursor
4. This is where you'll type all the commands

### What is GitHub?
**GitHub** is like Google Drive for code. It stores your project files online and can automatically turn them into a website that anyone can visit.

---

## Step 1: Install Dependencies

**What this does:** Downloads all the code libraries needed to run the app.

### Instructions:

1. **Open the terminal in Cursor** (see "How to Open the Terminal" above)

2. **Make sure you're in the right folder:**
   - The terminal should show you're in `/Users/mattlally/projects` (or similar)
   - If not, type: `cd /Users/mattlally/projects` and press Enter

3. **Type this command and press Enter:**
   ```bash
   npm install
   ```

4. **Wait for it to finish** (this can take 2-5 minutes)
   - You'll see lots of text scrolling by - that's normal!
   - Look for a message like "added 500 packages" or similar
   - When you see your cursor prompt again (usually shows `$` or `>`), it's done

5. **If you see errors:**
   - Make sure Node.js is installed (see "What You Need" above)
   - Try closing and reopening Cursor
   - See the Troubleshooting section below

**✅ Success looks like:** You see "added X packages" and no red error messages.

---

## Step 2: Test the App Locally

**What this does:** Starts a local web server so you can test the app on your computer before putting it online.

### Instructions:

1. **In the terminal, type:**
   ```bash
   npm run dev
   ```

2. **Press Enter**

3. **Wait a few seconds** - You'll see something like:
   ```
   VITE v7.x.x  ready in 500 ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Open your web browser** (Chrome, Firefox, Safari, etc.)

5. **Go to:** `http://localhost:5173`
   - You can click the link in the terminal, or copy/paste it into your browser

6. **You should see:** The Amazon Wrapped upload page!

7. **To stop the server:**
   - Go back to the terminal
   - Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)

**✅ Success looks like:** The app loads in your browser and you can see the upload interface.

**💡 Tip:** Keep this terminal window open while testing. If you close it, the server stops.

---

## Step 3: Set Up GitHub

**What this does:** Creates an online repository (folder) on GitHub where your code will live.

### Part A: Create a GitHub Repository

1. **Go to GitHub.com** and sign in

2. **Click the "+" icon** in the top right corner
   - Select **"New repository"**

3. **Fill in the form:**
   - **Repository name:** `amazon-wrapped-web` (or any name you like)
   - **Description:** "Amazon order history analyzer"
   - **Visibility:** Choose **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add a .gitignore or license (we have these)

4. **Click "Create repository"**

5. **Copy the repository URL** - You'll see it on the next page
   - It looks like: `https://github.com/YOUR_USERNAME/amazon-wrapped-web.git`
   - Save this URL somewhere - you'll need it!

### Part B: Update the Vite Config

**What this does:** Tells the app what URL it will be hosted at on GitHub Pages.

1. **In Cursor, open the file:** `vite.config.ts`
   - Look in the left sidebar (file explorer)
   - Click on `vite.config.ts`

2. **Find this line** (around line 9):
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/amazon-wrapped-web/' : '/',
   ```

3. **Replace `amazon-wrapped-web`** with your actual repository name
   - If your repo is called `my-amazon-wrapped`, change it to:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/my-amazon-wrapped/' : '/',
   ```

4. **Save the file:** Press `Ctrl + S` (Windows/Linux) or `Cmd + S` (Mac)

### Part C: Connect Your Local Project to GitHub

**What this does:** Links your local code folder to the GitHub repository you just created.

1. **Open the terminal in Cursor** (if not already open)

2. **Check if you have git initialized:**
   ```bash
   git status
   ```
   - If you see "not a git repository", continue to step 3
   - If you see file names, skip to step 4

3. **Initialize git** (only if needed):
   ```bash
   git init
   ```

4. **Add all files:**
   ```bash
   git add .
   ```

5. **Create your first commit:**
   ```bash
   git commit -m "Initial commit - Amazon Wrapped app"
   ```

6. **Connect to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   - Replace `YOUR_USERNAME` with your GitHub username
   - Replace `YOUR_REPO_NAME` with your repository name
   - Example: `git remote add origin https://github.com/johndoe/amazon-wrapped-web.git`

7. **Push your code:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

8. **If asked for credentials:**
   - GitHub no longer accepts passwords
   - You'll need a **Personal Access Token**
   - See "GitHub Authentication" section below

**✅ Success looks like:** You see "pushed to origin/main" and can see your files on GitHub.com

---

### GitHub Authentication (If Needed)

If `git push` asks for a password, you need a Personal Access Token:

1. **Go to GitHub.com** → Click your profile picture (top right) → **Settings**

2. **Scroll down** → Click **Developer settings** (left sidebar)

3. **Click "Personal access tokens"** → **"Tokens (classic)"**

4. **Click "Generate new token"** → **"Generate new token (classic)"**

5. **Fill in:**
   - **Note:** "Amazon Wrapped deployment"
   - **Expiration:** Choose 90 days (or longer)
   - **Scopes:** Check **"repo"** (this checks all repo permissions)

6. **Click "Generate token"** at the bottom

7. **COPY THE TOKEN IMMEDIATELY** - You won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`

8. **When git asks for password:**
   - Username: Your GitHub username
   - Password: Paste the token (not your actual password)

---

## Step 4: Deploy to GitHub Pages

**What this does:** Makes your app live on the internet for free!

### Part A: Enable GitHub Pages

1. **Go to your repository on GitHub.com**
   - Navigate to: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

2. **Click "Settings"** (top menu bar of the repository)

3. **Click "Pages"** (left sidebar)

4. **Under "Source":**
   - Select **"GitHub Actions"** (NOT "Deploy from a branch")
   - This tells GitHub to use the workflow file we created

5. **Click "Save"** (if there's a save button)

### Part B: Trigger the Deployment

The deployment happens automatically when you push code, but let's make sure it works:

1. **In Cursor's terminal, make sure you're in the project folder**

2. **Check if there are any changes:**
   ```bash
   git status
   ```

3. **If you see modified files, commit them:**
   ```bash
   git add .
   git commit -m "Update for deployment"
   git push
   ```

4. **Go to GitHub.com** → Your repository → **"Actions" tab** (top menu)

5. **You should see a workflow running:**
   - It will say "Deploy to GitHub Pages" or similar
   - Click on it to see progress
   - Wait 2-5 minutes for it to complete

6. **When it's done:**
   - Go back to **Settings** → **Pages**
   - You'll see a green checkmark and a URL
   - Your site is live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

**✅ Success looks like:** You can visit the URL and see your app working!

**⏱️ First deployment takes 5-10 minutes. Future updates take 2-5 minutes.**

---

## Troubleshooting

### "npm: command not found"
**Problem:** Node.js isn't installed or isn't in your PATH.

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Install it (use all default settings)
3. Close and reopen Cursor
4. Try `npm install` again

### "EACCES" or permission errors
**Problem:** npm doesn't have permission to write files.

**Solution (Mac/Linux):**
```bash
sudo npm install
```
(You'll need to enter your computer password)

**Better Solution:** Fix npm permissions permanently:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```
Then add this to your `~/.bashrc` or `~/.zshrc`:
```bash
export PATH=~/.npm-global/bin:$PATH
```

### "Port 5173 already in use"
**Problem:** Another app is using that port.

**Solution:**
1. Find what's using it: `lsof -ti:5173` (Mac/Linux) or `netstat -ano | findstr :5173` (Windows)
2. Kill that process, or
3. Use a different port: `npm run dev -- --port 3000`

### "GitHub Actions workflow not running"
**Problem:** The workflow file might not be committed.

**Solution:**
1. Check if `.github/workflows/deploy.yml` exists
2. If not, make sure you committed all files: `git add . && git commit -m "Add workflow"`
3. Push again: `git push`

### "404 Not Found" on GitHub Pages
**Problem:** The base path in `vite.config.ts` doesn't match your repo name.

**Solution:**
1. Check your repository name on GitHub
2. Update `vite.config.ts` to match exactly (case-sensitive!)
3. Commit and push again

### Charts not showing
**Problem:** Plotly.js might not be loading.

**Solution:**
1. Open browser console (F12 → Console tab)
2. Look for red error messages
3. Check if all dependencies installed: `npm install` again
4. Clear browser cache and reload

### "Cannot find module" errors
**Problem:** Dependencies didn't install correctly.

**Solution:**
1. Delete `node_modules` folder: `rm -rf node_modules` (Mac/Linux) or `rmdir /s node_modules` (Windows)
2. Delete `package-lock.json`: `rm package-lock.json`
3. Run `npm install` again

---

## Quick Reference: Common Commands

Here are the commands you'll use most often:

```bash
# Install dependencies (do this first, and after pulling updates)
npm install

# Start local development server
npm run dev

# Build for production (before deploying)
npm run build

# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Stop a running server
Ctrl + C (or Cmd + C on Mac)
```

---

## Need More Help?

- **GitHub Docs:** https://docs.github.com/en/pages
- **Node.js Help:** https://nodejs.org/en/docs/
- **Vite Docs:** https://vitejs.dev/guide/

Remember: Every developer was a beginner once. Don't be afraid to experiment and make mistakes!

