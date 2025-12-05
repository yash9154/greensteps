#!/bin/bash

# JWT Secret Token Generator for Linux/Mac
# Generates secure random tokens for JWT secrets

echo ""
echo "🔐 Generating JWT Secret Tokens..."
echo ""

# Run the Node.js script
node "$(dirname "$0")/generate-jwt-secrets.js"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ JWT secrets generated successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Check your .env file in the backend folder"
    echo "   2. JWT_ACCESS_SECRET and JWT_REFRESH_SECRET should be updated"
    echo "   3. Restart your backend server: npm run dev"
    echo ""
else
    echo ""
    echo "❌ Error generating secrets"
    echo "Make sure you're in the backend directory"
    echo ""
fi
