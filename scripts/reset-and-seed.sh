#!/bin/bash

# Script to reset databases and seed with fresh data
# Usage: ./scripts/reset-and-seed.sh

set -e

echo "🔄 Resetting databases and seeding fresh data..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Push database schemas (recreate tables)
echo -e "${BLUE}📦 Step 1: Pushing database schemas...${NC}"
pnpm db:push
echo -e "${GREEN}✅ Database schemas updated${NC}"
echo ""

# Step 2: Run seeds
echo -e "${BLUE}🌱 Step 2: Seeding databases...${NC}"
pnpm seed
echo -e "${GREEN}✅ All databases seeded${NC}"
echo ""

echo -e "${GREEN}🎉 Reset complete! Ready for testing.${NC}"
echo ""
echo "📝 Seeded data:"
echo "  - Admin: admin@example.com / Password123!"
echo "  - Users: 5 regular users"
echo "  - Categories: 5 categories"
echo "  - Products: 25 products"
echo "  - Orders: 10 sample orders"
echo "  - Reviews: 12 sample reviews"
echo ""
echo "🚀 Start services with: pnpm dev"
