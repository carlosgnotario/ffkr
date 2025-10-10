#!/bin/bash

# GitHub Pages Setup Script for FFKR
echo "🚀 Setting up GitHub Pages deployment for FFKR..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Initial commit - FFKR website"

echo ""
echo "✅ Setup complete! Next steps:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Name it 'ffkr' (or your preferred name)"
echo "   - Make it PUBLIC (required for free GitHub Pages)"
echo "   - Don't initialize with README, .gitignore, or license"
echo ""
echo "2. Connect your local repository:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/ffkr.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Enable GitHub Pages:"
echo "   - Go to your repository Settings"
echo "   - Scroll to 'Pages' section"
echo "   - Set Source to 'GitHub Actions'"
echo ""
echo "4. Your site will be available at:"
echo "   https://YOUR_USERNAME.github.io/ffkr"
echo ""
echo "🎉 Happy deploying!"
