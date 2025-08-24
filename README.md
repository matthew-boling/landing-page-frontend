# Incident Stakeholder Portal - Frontend

This repository contains the frontend application for the Incident Stakeholder Portal, built with React, TypeScript, and modern web technologies.

## 🏗️ **Architecture**

```
React App → API Gateway → Lambda Functions → incident.io
    ↓
User Interface & Experience
    ↓
Responsive Web Application
```

## 📁 **Repository Structure**

```
frontend-repo/
├── README.md                    # This file
├── package.json                 # Frontend dependencies
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
├── index.html                   # HTML entry point
├── src/                         # Application source code
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main application component
│   ├── index.css                # Global styles
│   ├── components/              # React components
│   │   ├── AuthLogin.tsx        # Authentication component
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── IncidentReportForm.tsx # Incident reporting form
│   │   ├── Chatbot.tsx          # Chat interface
│   │   ├── FloatingChat.tsx     # Floating chat widget
│   │   ├── WeeklyDigest.tsx     # Weekly digest component
│   │   └── ui/                  # UI component library
│   ├── services/                # API service layer
│   │   └── api.ts               # API client service
│   ├── styles/                  # Additional styles
│   │   └── globals.css          # Global CSS variables
│   └── guidelines/              # Development guidelines
│       └── Guidelines.md        # Coding standards
├── public/                      # Static assets
└── docs/                        # Frontend documentation
    ├── COMPONENTS.md            # Component documentation
    └── STYLING.md               # Styling guide
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser

### **Installation**
```bash
# Clone the repository
git clone <frontend-repo-url>
cd incident-stakeholder-portal-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Environment Configuration**
Create a `.env.local` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# For production, use your API Gateway URL:
# VITE_API_BASE_URL=https://your-api-gateway-url.execute-api.region.amazonaws.com/prod
```

## 🔧 **Configuration**

### **Build Tools**
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components

### **Development Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📊 **Components**

### **Core Components**

#### **App.tsx**
- Main application component
- Manages authentication state
- Routes between different views
- Handles user scope and permissions

#### **Dashboard.tsx**
- Incident overview dashboard
- Filtering and search capabilities
- Real-time incident data
- Digest settings and preferences

#### **AuthLogin.tsx**
- Magic link authentication
- Email validation
- JWT token management
- User session handling

#### **IncidentReportForm.tsx**
- New incident submission
- Form validation
- File attachments
- Priority and severity selection

#### **Chatbot.tsx**
- AI-powered chat interface
- Incident information retrieval
- Self-service assistance
- Context-aware responses

#### **FloatingChat.tsx**
- Persistent chat widget
- Minimizable interface
- Always accessible support
- Mobile-responsive design

### **UI Component Library**
Located in `src/components/ui/`, includes:
- **Form Components**: Input, Select, Textarea, etc.
- **Layout Components**: Card, Container, Grid, etc.
- **Interactive Components**: Button, Modal, Dropdown, etc.
- **Data Display**: Table, Chart, Badge, etc.

## 🎨 **Styling**

### **CSS Architecture**
- **Tailwind CSS**: Utility-first approach
- **CSS Variables**: Custom properties for theming
- **Component Scoping**: Scoped styles per component
- **Responsive Design**: Mobile-first approach

### **Design System**
- **Color Palette**: Consistent color scheme
- **Typography**: Unified font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI patterns

## 🔌 **API Integration**

### **Service Layer**
The `src/services/api.ts` file handles all API communication:

```typescript
// API endpoints
const API_ENDPOINTS = {
  auth: '/auth',
  incidents: '/incidents',
  reports: '/reports',
  chat: '/chat'
};

// Service methods
export const apiService = {
  getIncidents: () => apiCall('GET', '/incidents'),
  submitReport: (data) => apiCall('POST', '/reports', data),
  authenticate: (email) => apiCall('POST', '/auth', { email }),
  chatMessage: (message, userScope) => apiCall('POST', '/chat', { message, userScope })
};
```

### **Authentication Flow**
1. User enters email in login form
2. Frontend calls `/auth` endpoint
3. Backend sends magic link email
4. User clicks link and gets JWT token
5. Token stored in localStorage
6. Subsequent requests include token

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**
- Base styles for mobile devices
- Progressive enhancement for larger screens
- Touch-friendly interactions
- Optimized for mobile performance

## 🧪 **Testing**

### **Testing Strategy**
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Complete user workflow testing
- **Visual Regression**: UI consistency testing

### **Testing Tools**
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 **Deployment**

### **Local Development**
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### **Production Deployment**

#### **Option 1: Manual Deployment**
```bash
# Deploy to S3 + CloudFront
./scripts/deploy-frontend.sh

# Build only (no deployment)
./scripts/deploy-frontend.sh --build-only

# Deploy only (requires existing build)
./scripts/deploy-frontend.sh --deploy-only
```

#### **Option 2: CircleCI Pipeline (Recommended)**
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

### **Deployment Prerequisites**
- ✅ AWS CLI configured with appropriate permissions
- ✅ Infrastructure deployed via Terraform (creates S3 bucket and CloudFront)
- ✅ Infrastructure repository in `../infrastructure-repo` directory

### **Repository Structure**
```
parent-directory/
├── frontend-repo/        (this repository)
│   ├── src/              # React source code
│   ├── scripts/          # Deployment scripts
│   └── .circleci/        # Frontend CI/CD pipeline
└── infrastructure-repo/   # AWS infrastructure configuration
    ├── terraform/         # Terraform configurations
    └── .circleci/         # Infrastructure CI/CD pipeline
```

## 🔒 **Security Considerations**

### **Frontend Security**
- **Input Validation**: Client-side form validation
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Token-based CSRF prevention
- **Content Security Policy**: CSP headers configuration

### **API Security**
- **HTTPS Only**: All API calls use HTTPS
- **JWT Tokens**: Secure authentication tokens
- **CORS Configuration**: Proper cross-origin settings
- **Rate Limiting**: API rate limiting protection

## 📊 **Performance**

### **Optimization Techniques**
- **Code Splitting**: Lazy loading of components
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer

### **Performance Metrics**
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## 🔍 **Debugging**

### **Development Tools**
- **React DevTools**: Component inspection
- **Redux DevTools**: State management debugging
- **Network Tab**: API call monitoring
- **Console Logging**: Debug information

### **Error Handling**
```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
}

// API error handling
try {
  const data = await apiService.getIncidents();
  setIncidents(data.incidents);
} catch (error) {
  setError(error.message);
  // Fallback to mock data in development
}
```

## 📚 **Documentation**

### **Component Documentation**
Each component includes:
- **Purpose**: What the component does
- **Props**: Input parameters and types
- **Usage**: Example usage patterns
- **Styling**: CSS classes and customization

### **API Documentation**
- **Endpoints**: Available API routes
- **Request/Response**: Data formats
- **Authentication**: Required headers
- **Error Codes**: HTTP status codes

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### **API Connection Issues**
```bash
# Verify environment variables
echo $VITE_API_BASE_URL

# Check CORS configuration
# Verify API Gateway is running
```

#### **Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css

# Check CSS imports
# Verify Tailwind configuration
```

## 📞 **Support**

For frontend development issues:
1. Check component documentation
2. Review browser console for errors
3. Verify API endpoint configuration
4. Contact frontend development team

---

**Note**: This frontend repository is designed to work with the backend repository for API calls and the infrastructure repository for deployment configuration. 