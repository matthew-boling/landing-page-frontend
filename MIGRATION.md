# Frontend Repository Migration Guide

This guide helps you migrate from the integrated Incident Stakeholder Portal repository to the new separate frontend repository.

## 🚀 **Why Separate the Frontend?**

### **Benefits**
- **Separation of Concerns**: Frontend code managed independently
- **Team Autonomy**: UI/UX team can work without backend dependencies
- **Technology Evolution**: Can upgrade React, build tools, and dependencies independently
- **Deployment Flexibility**: Can deploy to any hosting platform
- **Development Speed**: Faster builds and development server startup

### **Repository Structure**
```
Before (Integrated):
incident-stakeholder-portal/
├── src/                    # Frontend code
├── lambda/                 # Backend code
└── infrastructure/         # Infrastructure code

After (Separated):
incident-stakeholder-portal/          # Main repository (documentation)
incident-stakeholder-portal-frontend  # Frontend repository
incident-stakeholder-portal-backend   # Backend repository
incident-stakeholder-portal-infra     # Infrastructure repository
```

## 📋 **Migration Steps**

### **Step 1: Create New Frontend Repository**

1. **Create a new repository** on GitHub/GitLab:
   ```bash
   # Example: incident-stakeholder-portal-frontend
   ```

2. **Clone the new repository**:
   ```bash
   git clone <frontend-repo-url>
   cd incident-stakeholder-portal-frontend
   ```

### **Step 2: Copy Frontend Files**

1. **Copy source code** from the old repository:
   ```bash
   # From the main repository
   cp -r ../incident-stakeholder-portal/src/* src/
   cp ../incident-stakeholder-portal/package.json .
   cp ../incident-stakeholder-portal/vite.config.ts .
   cp ../incident-stakeholder-portal/index.html .
   ```

2. **Copy configuration files**:
   ```bash
   # Copy any additional config files
   cp ../incident-stakeholder-portal/tsconfig.json . 2>/dev/null || echo "tsconfig.json not found"
   cp ../incident-stakeholder-portal/.env.example . 2>/dev/null || echo ".env.example not found"
   ```

### **Step 3: Setup Frontend Repository**

1. **Run setup script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test the application**:
   ```bash
   npm run dev
   ```

### **Step 4: Update Configuration**

1. **Environment variables**:
   ```bash
   # Edit .env.local with your API configuration
   VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
   ```

2. **API service configuration**:
   - Update `src/services/api.ts` if needed
   - Verify API endpoints match backend repository
   - Test API connectivity

### **Step 5: Clean Up Main Repository**

1. **Remove frontend files** from the main repository:
   ```bash
   cd ../incident-stakeholder-portal
   rm -rf src/
   rm -f package.json
   rm -f vite.config.ts
   rm -f index.html
   rm -f tsconfig.json
   ```

2. **Update documentation** to reference the new frontend repository

## 🔧 **Configuration Changes**

### **Environment Variables**
```bash
# Before (in main repository)
VITE_API_BASE_URL=http://localhost:3000

# After (in frontend repository)
VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
```

### **Build Configuration**
- **Vite**: Build tool configuration remains the same
- **TypeScript**: Configuration may need updates for new repository structure
- **Dependencies**: Package.json dependencies remain the same

### **API Configuration**
- **Base URL**: Must point to deployed API Gateway
- **CORS**: Configured in infrastructure repository
- **Authentication**: JWT tokens from backend repository

## 🚨 **Important Considerations**

### **API Dependencies**
- **Backend Repository**: Must be deployed before frontend can work
- **Infrastructure Repository**: Must provide API Gateway URL
- **Environment Variables**: Must be configured correctly

### **Development Workflow**
- **Local Development**: Frontend can run independently with mock data
- **API Testing**: Requires backend to be running or deployed
- **Build Process**: Frontend builds independently

### **Deployment**
- **Hosting**: Can use any static hosting platform
- **Environment**: Must have access to backend API
- **Configuration**: Environment variables must be set

## 🔍 **Verification Checklist**

- [ ] Frontend repository created and populated
- [ ] Source code copied successfully
- [ ] Dependencies installed
- [ ] Development server starts
- [ ] Application loads in browser
- [ ] API configuration updated
- [ ] Environment variables set
- [ ] Old frontend files removed from main repository
- [ ] Documentation updated
- [ ] Team notified of changes

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Dependencies not found**:
   ```bash
   # Clear and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Build failures**:
   ```bash
   # Check Node.js version
   node --version  # Should be 18+
   
   # Check TypeScript configuration
   npm run type-check
   ```

3. **API connection issues**:
   ```bash
   # Verify environment variables
   echo $VITE_API_BASE_URL
   
   # Check CORS configuration
   # Verify backend is deployed
   ```

4. **Component import errors**:
   ```bash
   # Check file paths
   # Verify component exports
   # Check TypeScript configuration
   ```

### **Rollback Plan**

If migration fails:
1. **Stop frontend development**
2. **Revert main repository**:
   ```bash
   cd ../incident-stakeholder-portal
   git checkout HEAD -- src/ package.json vite.config.ts index.html
   ```
3. **Investigate issues**
4. **Fix and retry migration**

## 📞 **Support**

For migration assistance:
1. Check this migration guide
2. Review frontend setup script
3. Verify API configuration
4. Contact frontend development team

---

**Note**: This migration is a one-time process. Once completed, the frontend will be managed independently through the dedicated repository. 