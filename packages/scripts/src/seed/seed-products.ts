/**
 * Seed Products Service Database
 * Creates categories and products using Drizzle Seed
 */

import { categories, products } from '@repo/database-schemas/products'
import { seed } from 'drizzle-seed'
import { createConnection, getDatabaseUrl } from '../utils/database.js'
import { ensureTablesExist } from '../utils/validation.js'

// Predefined categories with realistic data
const categoryData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, computers, and electronic devices',
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Fashion apparel for men, women, and children',
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Wide selection of books across all genres',
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Everything for your home and outdoor spaces',
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sports equipment and outdoor gear',
  },
]

/**
 * Seed products database with 5 categories and 25 products
 */
export async function seedProducts() {
  console.log('🌱 Seeding products database...')

  try {
    const databaseUrl = getDatabaseUrl('products')
    const db = createConnection(databaseUrl)

    // Ensure tables exist
    await ensureTablesExist(db, ['categories', 'products'], 'products')

    // Clear existing data
    console.log('   🧹 Clearing existing products and categories...')
    await db.execute('TRUNCATE TABLE products.products, products.categories CASCADE')

    // Insert categories first (needed for foreign keys)
    const insertedCategories = await db.insert(categories).values(categoryData).returning()
    console.log(`   ✓ Created ${insertedCategories.length} categories`)

    // Create products using Drizzle Seed with relation to categories
    await seed(db, { products }, { count: 25 }).refine((f) => ({
      products: {
        columns: {
          categoryId: f.valuesFromArray({
            values: insertedCategories.map((c) => c.id),
          }),
          name: f.valuesFromArray({
            values: [
              'Laptop Dell XPS 15',
              'iPhone 15 Pro',
              'Sony Headphones WH-1000XM5',
              'Samsung 4K Smart TV',
              'MacBook Pro M3',
              "Men's Cotton T-Shirt",
              "Women's Jeans",
              'Winter Jacket',
              'Running Shoes',
              'Leather Belt',
              'The Great Gatsby',
              'Harry Potter Set',
              '1984 by George Orwell',
              'To Kill a Mockingbird',
              'The Hobbit',
              'Coffee Maker',
              'Garden Hose',
              'LED Desk Lamp',
              'Kitchen Knife Set',
              'Yoga Mat',
              'Tennis Racket',
              'Basketball',
              'Camping Tent',
              'Fishing Rod',
              'Dumbbell Set',
            ],
          }),
          slug: f.valuesFromArray({
            values: [
              'laptop-dell-xps-15',
              'iphone-15-pro',
              'sony-headphones-wh1000xm5',
              'samsung-4k-smart-tv',
              'macbook-pro-m3',
              'mens-cotton-tshirt',
              'womens-jeans',
              'winter-jacket',
              'running-shoes',
              'leather-belt',
              'the-great-gatsby',
              'harry-potter-set',
              '1984-george-orwell',
              'to-kill-a-mockingbird',
              'the-hobbit',
              'coffee-maker',
              'garden-hose',
              'led-desk-lamp',
              'kitchen-knife-set',
              'yoga-mat',
              'tennis-racket',
              'basketball',
              'camping-tent',
              'fishing-rod',
              'dumbbell-set',
            ],
          }),
          description: f.loremIpsum({ sentencesCount: 2 }),
          price: f.valuesFromArray({
            values: [
              '1299.99',
              '999.99',
              '349.99',
              '799.99',
              '1999.99',
              '19.99',
              '49.99',
              '89.99',
              '79.99',
              '24.99',
              '14.99',
              '59.99',
              '12.99',
              '13.99',
              '15.99',
              '69.99',
              '29.99',
              '39.99',
              '89.99',
              '34.99',
              '129.99',
              '24.99',
              '199.99',
              '79.99',
              '149.99',
            ],
          }),
          sku: f.valuesFromArray({
            values: Array.from({ length: 25 }, (_, i) => `SKU-${String(i + 1).padStart(5, '0')}`),
          }),
          stockQuantity: f.int({ minValue: 5, maxValue: 100 }),
          imageUrl: f.default({ defaultValue: null }),
        },
      },
    }))

    console.log('✅ Products database seeded successfully')
    console.log(
      '   - 5 categories (Electronics, Clothing, Books, Home & Garden, Sports & Outdoors)',
    )
    console.log('   - 25 products with realistic data')
  } catch (error) {
    console.error('❌ Failed to seed products database:', error)
    throw error
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
