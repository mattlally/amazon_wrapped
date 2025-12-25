# Git Commands for Your Repository

Run these commands **one at a time** in the Cursor terminal:

## Step 1: Initialize Git
```bash
git init
```

## Step 2: Add all files
```bash
git add .
```

## Step 3: Create your first commit
```bash
git commit -m "Initial commit: Amazon Wrapped app"
```

## Step 4: Add your GitHub repository
```bash
git remote add origin https://github.com/mattlally/amazon_wrapped.git
```

## Step 5: Set main branch and push
```bash
git branch -M main
git push -u origin main
```

**Note:** When you run `git push`, GitHub will ask you to log in. You can either:
- Use a personal access token (recommended)
- Or use GitHub CLI if you have it installed

---

## If you get an authentication error:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use that token as your password when pushing

