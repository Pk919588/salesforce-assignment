#!/bin/bash
# Installation & Verification Guide
# Run this after npm install to verify everything is set up correctly

echo "🔍 Salesforce Validation Rules Manager - Installation Verification"
echo "=================================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "📁 Please run this from the salesforce-ui directory"
    exit 1
fi

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  ✅ Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "  ✅ npm installed: $NPM_VERSION"
else
    echo "  ❌ npm not found."
    exit 1
fi

# Check if node_modules exists
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules directory exists"
else
    echo "  ⚠️  node_modules not found. Run: npm install"
fi

# Check .env file
echo "✓ Checking environment configuration..."
if [ -f ".env" ]; then
    echo "  ✅ .env file exists"
    if grep -q "REACT_APP_SALESFORCE_CLIENT_ID" ".env"; then
        echo "  ✅ REACT_APP_SALESFORCE_CLIENT_ID configured"
    else
        echo "  ⚠️  REACT_APP_SALESFORCE_CLIENT_ID not set in .env"
    fi
else
    echo "  ⚠️  .env file not found. Run: cp .env.example .env"
fi

# Check key files
echo "✓ Checking component files..."
FILES=(
    "src/App.js"
    "src/Login.js"
    "src/ValidationRules.js"
    "src/Callback.js"
    "src/SalesforceService.js"
    "src/config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file missing"
    fi
done

# Check documentation files
echo "✓ Checking documentation..."
DOCS=(
    "SETUP_GUIDE.md"
    "CHECKLIST.md"
    "DEVELOPER.md"
    "QUICK_REFERENCE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc missing"
    fi
done

echo ""
echo "=================================================================="
echo "✅ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Configure .env file with your Salesforce credentials"
echo "2. Run: npm start"
echo "3. Follow CHECKLIST.md to verify Salesforce setup"
echo ""
echo "📚 Documentation:"
echo "   - SETUP_GUIDE.md: Complete setup instructions"
echo "   - CHECKLIST.md: Verification steps"
echo "   - QUICK_REFERENCE.md: Quick commands"
echo "   - DEVELOPER.md: Architecture & extending"
echo ""
echo "🚀 Ready to start? Run: npm start"
echo "=================================================================="
