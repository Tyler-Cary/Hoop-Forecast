# 📤 Uploading HoopForecast to GitHub

## Step-by-Step Guide

### Option 1: Using GitHub CLI (Fastest)

If you have GitHub CLI installed:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HoopForecast NBA prediction app"

# Create repository on GitHub and push
gh repo create hoopforecast --public --source=. --remote=origin --push
```

### Option 2: Using GitHub Website (Recommended for beginners)

#### Step 1: Initialize Git Repository

```bash
# Navigate to project directory
cd /Applications/Project

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HoopForecast NBA prediction app"
```

#### Step 2: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `hoopforecast` (or any name you prefer)
4. Description: "NBA points prediction app with linear regression and betting comparison"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

#### Step 3: Connect and Push

GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hoopforecast.git

# Rename main branch (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

#### Step 4: Verify

Refresh your GitHub repository page - you should see all your files!

### Option 3: Using GitHub Desktop

1. Download [GitHub Desktop](https://desktop.github.com/)
2. File → Add Local Repository → Select `/Applications/Project`
3. Click "Publish repository" button
4. Choose name and visibility
5. Click "Publish repository"

## Important Notes

✅ **What's included:**
- All source code
- README.md and documentation
- .env.example (template, no secrets)
- package.json files

❌ **What's NOT included (thanks to .gitignore):**
- `node_modules/` folders
- `.env` files (your API keys stay local!)
- Build outputs
- OS files (.DS_Store, etc.)

## After Uploading

### Add a Repository Description

On your GitHub repo page, click the gear icon next to "About" and add:
- Description: "NBA points prediction app using linear regression"
- Topics: `nba`, `react`, `nodejs`, `machine-learning`, `betting`, `sports-analytics`

### Optional: Add a License

If you want to add a license:

```bash
# Create LICENSE file (MIT License example)
curl -o LICENSE https://raw.githubusercontent.com/licenses/license-templates/master/templates/mit.txt

# Edit LICENSE and replace [year] and [fullname]

# Commit and push
git add LICENSE
git commit -m "Add MIT license"
git push
```

## Updating Your Repository

After making changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Troubleshooting

**"Repository not found" error:**
- Check that you've added the remote correctly
- Verify your GitHub username in the URL

**"Permission denied" error:**
- You may need to set up SSH keys or use a personal access token
- See: https://docs.github.com/en/authentication

**Large file warnings:**
- If `node_modules` accidentally got committed, remove it:
  ```bash
  git rm -r --cached node_modules
  git commit -m "Remove node_modules"
  git push
  ```

