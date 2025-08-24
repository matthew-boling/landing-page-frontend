#!/bin/bash

# Frontend Deployment Script
# This script builds and deploys the React frontend to S3 + CloudFront

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/dist"
INFRASTRUCTURE_REPO="$PROJECT_ROOT/../infrastructure-repo"
AWS_REGION="${AWS_DEFAULT_REGION:-us-east-1}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials are not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install it first."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

get_infrastructure_outputs() {
    log_info "Getting infrastructure outputs..."
    
    if [ ! -d "$INFRASTRUCTURE_REPO" ]; then
        log_error "Infrastructure repository not found at: $INFRASTRUCTURE_REPO"
        log_error "Make sure the infrastructure-repo is in the same parent directory as frontend-repo"
        exit 1
    fi
    
    cd "$INFRASTRUCTURE_REPO/terraform"
    
    # Get S3 bucket name
    S3_BUCKET=$(terraform output -raw frontend_s3_bucket_name 2>/dev/null || echo "")
    if [ -z "$S3_BUCKET" ]; then
        log_error "Could not get S3 bucket name from Terraform outputs"
        log_error "Make sure infrastructure is deployed first"
        exit 1
    fi
    
    # Get CloudFront distribution ID
    CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw frontend_cloudfront_distribution_id 2>/dev/null || echo "")
    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        log_error "Could not get CloudFront distribution ID from Terraform outputs"
        log_error "Make sure infrastructure is deployed first"
        exit 1
    fi
    
    log_success "Infrastructure outputs retrieved"
    log_info "S3 Bucket: $S3_BUCKET"
    log_info "CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
}

build_frontend() {
    log_info "Building frontend application..."
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        log_info "Installing frontend dependencies..."
        npm install
    fi
    
    # Build the application
    log_info "Building React application..."
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Build failed - dist directory not found"
        exit 1
    fi
    
    log_success "Frontend built successfully"
}

deploy_to_s3() {
    log_info "Deploying frontend to S3..."
    
    # Sync build files to S3
    aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
        --delete \
        --cache-control "max-age=3600" \
        --exclude "*.html" \
        --exclude "*.js" \
        --exclude "*.css"
    
    # Upload HTML files with no-cache headers
    aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
        --include "*.html" \
        --cache-control "no-cache, no-store, must-revalidate"
    
    # Upload JS and CSS files with long cache headers
    aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" \
        --include "*.js" \
        --include "*.css" \
        --cache-control "max-age=31536000"
    
    log_success "Frontend deployed to S3 successfully"
}

invalidate_cloudfront() {
    log_info "Invalidating CloudFront cache..."
    
    # Create invalidation
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --region "$AWS_REGION" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    log_info "CloudFront invalidation created: $INVALIDATION_ID"
    
    # Wait for invalidation to complete
    log_info "Waiting for CloudFront invalidation to complete..."
    aws cloudfront wait invalidation-completed \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --id "$INVALIDATION_ID" \
        --region "$AWS_REGION"
    
    log_success "CloudFront cache invalidated successfully"
}

get_frontend_url() {
    log_info "Getting frontend URL..."
    
    cd "$INFRASTRUCTURE_REPO/terraform"
    
    # Get CloudFront domain
    CLOUDFRONT_DOMAIN=$(terraform output -raw frontend_cloudfront_distribution_domain 2>/dev/null || echo "")
    
    if [ -n "$CLOUDFRONT_DOMAIN" ]; then
        FRONTEND_URL="https://$CLOUDFRONT_DOMAIN"
        log_success "Frontend URL: $FRONTEND_URL"
    else
        log_warning "Could not get CloudFront domain from Terraform outputs"
    fi
}

main() {
    log_info "Starting frontend deployment..."
    
    check_prerequisites
    get_infrastructure_outputs
    build_frontend
    deploy_to_s3
    invalidate_cloudfront
    get_frontend_url
    
    log_success "Frontend deployment completed successfully!"
    
    if [ -n "$FRONTEND_URL" ]; then
        echo ""
        echo "🎉 Your frontend is now live at:"
        echo "   $FRONTEND_URL"
        echo ""
        echo "Note: It may take a few minutes for changes to propagate globally."
    fi
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --build-only   Only build the frontend, don't deploy"
        echo "  --deploy-only  Only deploy to S3, don't build"
        echo ""
        echo "Environment Variables:"
        echo "  AWS_DEFAULT_REGION  AWS region (default: us-east-1)"
        echo ""
        echo "Prerequisites:"
        echo "  - AWS CLI configured with appropriate permissions"
        echo "  - Node.js and npm installed"
        echo "  - Infrastructure deployed via Terraform"
        echo "  - Infrastructure repository in ../infrastructure-repo"
        echo ""
        echo "Repository Structure:"
        echo "  parent-directory/"
        echo "  ├── frontend-repo/        (this repository)"
        echo "  └── infrastructure-repo/  (infrastructure configuration)"
        exit 0
        ;;
    --build-only)
        check_prerequisites
        build_frontend
        log_success "Frontend build completed successfully!"
        exit 0
        ;;
    --deploy-only)
        check_prerequisites
        get_infrastructure_outputs
        deploy_to_s3
        invalidate_cloudfront
        get_frontend_url
        log_success "Frontend deployment completed successfully!"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac 