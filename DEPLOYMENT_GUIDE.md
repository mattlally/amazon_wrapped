# 🚀 How to Deploy Your Amazon Wrapped App to GitHub Pages

This guide will walk you through publishing your app to GitHub and getting a free public URL you can share with friends!

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click "Sign up" and create a free account
3. Verify your email address

## Step 2: Create a New Repository on GitHub

1. Log into GitHub
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in:
   - **Repository name:** `amazon-wrapped-web` (or any name you like)
   - **Description:** "Amazon Prime Wrapped - Interactive spending dashboard"
   - **Visibility:** Choose **Public** (required for free GitHub Pages)
   - **DO NOT** check "Initialize with README" (we already have files)
5. Click **"Create repository"**

## Step 3: Update the Base Path in Your Code

**IMPORTANT:** Before pushing, you need to update the repository name in `vite.config.ts` to match your GitHub repository name.

1. Open `vite.config.ts` in your project
2. Find this line:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/amazon-wrapped-web/' : '/',
   ```
3. Replace `amazon-wrapped-web` with your actual repository name
   - For example, if your repo is `my-amazon-wrapped`, change it to:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/my-amazon-wrapped/' : '/',
   ```

## Step 4: Push Your Code to GitHub

Open your terminal (in Cursor or your computer's terminal) and run these commands:

```bash
# Navigate to your project folder (if not already there)
cd /Users/mattlally/projects

# Initialize git (if not already done)
git init

# Add all your files
git add .

# Create your first commit
git commit -m "Initial commit: Amazon Wrapped app"

# Add your GitHub repository as the remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name!**

For example, if your username is `johndoe` and your repo is `amazon-wrapped-web`, the command would be:
```bash
git remote add origin https://github.com/johndoe/amazon-wrapped-web.git
```

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub (the page you just created)
2. Click on **"Settings"** (top menu bar)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **"Save"**

## Step 6: Wait for Deployment

1. After saving, GitHub will start building your site
2. Go to the **"Actions"** tab in your repository
3. You'll see a workflow running called "Deploy to GitHub Pages"
4. Wait 2-3 minutes for it to complete (you'll see a green checkmark ✅ when done)

## Step 7: Get Your Public URL

Once deployment is complete:

1. Go back to **Settings → Pages**
2. You'll see your site URL at the top:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

   For example: `https://johndoe.github.io/amazon-wrapped-web/`

2. **Copy this URL** - this is what you'll share with friends!

## Step 8: Share with Friends! 🎉

Send your friends the GitHub Pages URL. They can:
- Upload their own CSV files
- See their spending insights
- All processing happens in their browser (no data sent to any server)

## Troubleshooting

### The site shows a 404 error
- Make sure you updated the `base` path in `vite.config.ts` to match your repository name
- Wait a few more minutes - GitHub Pages can take 5-10 minutes to propagate
- Check the Actions tab to make sure the deployment succeeded

### The deployment failed
- Check the Actions tab for error messages
- Make sure all your code is committed and pushed
- Try running `npm run build` locally to see if there are any build errors

### I want to update my site
- Just make changes to your code
- Run:
  ```bash
  git add .
  git commit -m "Update: description of your changes"
  git push
  ```
- GitHub will automatically rebuild and deploy your site!

## Your Free URL Format

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

This is completely free and doesn't require a custom domain name!

---

**Need help?** Check the Actions tab in your GitHub repository to see deployment logs and any error messages.

