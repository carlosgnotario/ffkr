# GitHub Pages Setup Script for FFKR
Write-Host "🚀 Setting up GitHub Pages deployment for FFKR..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "📦 Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit - FFKR website"

Write-Host ""
Write-Host "✅ Setup complete! Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor Cyan
Write-Host "   - Go to https://github.com/new"
Write-Host "   - Name it 'ffkr' (or your preferred name)"
Write-Host "   - Make it PUBLIC (required for free GitHub Pages)"
Write-Host "   - Don't initialize with README, .gitignore, or license"
Write-Host ""
Write-Host "2. Connect your local repository:" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/ffkr.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""
Write-Host "3. Enable GitHub Pages:" -ForegroundColor Cyan
Write-Host "   - Go to your repository Settings"
Write-Host "   - Scroll to 'Pages' section"
Write-Host "   - Set Source to 'GitHub Actions'"
Write-Host ""
Write-Host "4. Your site will be available at:" -ForegroundColor Cyan
Write-Host "   https://YOUR_USERNAME.github.io/ffkr"
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
