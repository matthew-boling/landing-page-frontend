#!/bin/bash

# Incident Stakeholder Portal - Frontend Setup Script
# This script sets up the frontend repository for development

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎨 Setting up Incident Stakeholder Portal Frontend${NC}"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ This script must be run from the frontend repository root${NC}"
    echo -e "${YELLOW}Please navigate to the frontend repository directory and try again${NC}"
    exit 1
fi

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
echo -e "${BLUE}Node.js version: $NODE_VERSION${NC}"

# Check npm version
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm${NC}"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo -e "${BLUE}npm version: $NPM_VERSION${NC}"

# Create environment file
echo -e "${YELLOW}Setting up environment configuration...${NC}"
if [ ! -f ".env.local" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env.local
        echo -e "${GREEN}✅ Created .env.local from example${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env.local with your API configuration${NC}"
    else
        echo -e "${YELLOW}⚠️  env.example not found, creating basic .env.local${NC}"
        cat > .env.local << 'EOF'
# Frontend Environment Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME="Incident Stakeholder Portal"
VITE_APP_VERSION="1.0.0"
EOF
        echo -e "${GREEN}✅ Created basic .env.local${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local already exists${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Check if build works
echo -e "${YELLOW}Testing build process...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build test successful${NC}"
else
    echo -e "${YELLOW}⚠️  Build test failed, but continuing...${NC}"
fi

# Create additional directories
echo -e "${YELLOW}Creating additional directories...${NC}"
mkdir -p docs
mkdir -p public

# Create component documentation
if [ ! -f "docs/COMPONENTS.md" ]; then
    cat > docs/COMPONENTS.md << 'EOF'
# Component Documentation

This document describes the React components used in the Incident Stakeholder Portal.

## Core Components

### App.tsx
Main application component that manages routing and state.

### Dashboard.tsx
Main dashboard showing incident overview and filters.

### AuthLogin.tsx
Authentication component for magic link login.

### IncidentReportForm.tsx
Form for submitting new incident reports.

### Chatbot.tsx
AI-powered chat interface for user assistance.

### FloatingChat.tsx
Persistent floating chat widget.

## UI Components

Located in `src/components/ui/`, these are reusable UI components built with Shadcn/ui.

## Usage

Each component includes:
- Props interface
- Example usage
- Styling guidelines
- Accessibility notes
EOF
    echo -e "${GREEN}✅ Created component documentation${NC}"
fi

# Create styling guide
if [ ! -f "docs/STYLING.md" ]; then
    cat > docs/STYLING.md << 'EOF'
# Styling Guide

This document covers the styling approach used in the Incident Stakeholder Portal.

## CSS Architecture

### Tailwind CSS
- Utility-first approach
- Responsive design utilities
- Custom color palette
- Component variants

### CSS Variables
- Custom properties for theming
- Consistent spacing scale
- Color scheme definitions
- Typography settings

## Design System

### Colors
- Primary: Brand colors
- Secondary: Supporting colors
- Accent: Highlight colors
- Neutral: Grayscale colors

### Typography
- Font families
- Size scale
- Weight variations
- Line heights

### Spacing
- Consistent spacing scale
- Responsive breakpoints
- Component padding/margins
EOF
    echo -e "${GREEN}✅ Created styling guide${NC}"
fi

# Setup Git hooks (optional)
echo -e "${YELLOW}Setting up Git hooks...${NC}"
if [ -d ".git" ]; then
    # Create pre-commit hook for code quality
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Check TypeScript
if npm run type-check > /dev/null 2>&1; then
    echo "✅ TypeScript check passed"
else
    echo "❌ TypeScript check failed"
    exit 1
fi

# Check linting
if npm run lint > /dev/null 2>&1; then
    echo "✅ Linting check passed"
else
    echo "❌ Linting check failed"
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF

    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Git pre-commit hook created${NC}"
else
    echo -e "${YELLOW}⚠️  Not a Git repository, skipping Git hooks${NC}"
fi

# Final setup instructions
echo ""
echo -e "${BLUE}======================================================"
echo -e "Setup Complete!${NC}"
echo -e "${BLUE}======================================================"
echo ""
echo -e "${GREEN}✅ Frontend repository is ready${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo -e "${BLUE}1. Edit .env.local with your API configuration${NC}"
echo -e "${BLUE}2. Start development server: npm run dev${NC}"
echo -e "${BLUE}3. Build for production: npm run build${NC}"
echo -e "${BLUE}4. Test the application in your browser${NC}"
echo ""
echo -e "${YELLOW}For development:${NC}"
echo -e "${BLUE}- Edit components in src/components/${NC}"
echo -e "${BLUE}- Update styles in src/styles/${NC}"
echo -e "${BLUE}- Configure API in src/services/api.ts${NC}"
echo -e "${BLUE}- Run tests: npm test${NC}"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}" 