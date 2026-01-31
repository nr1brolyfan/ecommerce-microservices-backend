#!/bin/bash

# Quick smoke test to check if all services are running
# Usage: ./scripts/smoke-test.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Running smoke tests on all microservices..."
echo ""

# Function to test service
test_service() {
    local name=$1
    local url=$2
    local endpoint=$3
    
    if curl -s -f "${url}${endpoint}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${name} is running (${url})${NC}"
        return 0
    else
        echo -e "${RED}❌ ${name} is NOT running (${url})${NC}"
        return 1
    fi
}

# Test each service
failed=0

test_service "Auth Service" "http://localhost:3000" "/api/auth/login" || ((failed++))
test_service "Products Service" "http://localhost:3001" "/api/products" || ((failed++))
test_service "Cart Service" "http://localhost:3002" "/api/cart" || ((failed++))
test_service "Orders Service" "http://localhost:3003" "/api/orders" || ((failed++))
test_service "Reviews Service" "http://localhost:3004" "/api/reviews" || ((failed++))

echo ""

# Summary
if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 All services are running!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  ${failed} service(s) failed. Run 'pnpm dev' to start services.${NC}"
    exit 1
fi
