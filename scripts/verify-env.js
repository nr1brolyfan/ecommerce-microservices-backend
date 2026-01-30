#!/usr/bin/env node

/**
 * Verify Environment Variables
 * Checks if all required environment variables are set
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file
const envPath = join(__dirname, '..', '.env')
let envContent

try {
  envContent = readFileSync(envPath, 'utf-8')
} catch (error) {
  console.error('❌ .env file not found!', error)
  console.log('Run: cp .env.example .env')
  process.exit(1)
}

// Parse .env
const env = {}
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim()
    }
  }
})

// Required variables
const required = [
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'AUTH_DATABASE_URL',
  'PRODUCTS_DATABASE_URL',
  'CART_DATABASE_URL',
  'ORDERS_DATABASE_URL',
  'REVIEWS_DATABASE_URL',
  'JWT_SECRET',
  'AUTH_SERVICE_URL',
  'PRODUCTS_SERVICE_URL',
  'CART_SERVICE_URL',
  'ORDERS_SERVICE_URL',
  'REVIEWS_SERVICE_URL',
  'NODE_ENV',
]

console.log('🔍 Verifying environment variables...\n')

let allPresent = true
const warnings = []

required.forEach((key) => {
  if (!env[key]) {
    console.log(`❌ Missing: ${key}`)
    allPresent = false
  } else {
    console.log(`✅ ${key}`)

    // Check for placeholder values
    if (env[key].includes('your-') || env[key].includes('change-in-production')) {
      warnings.push(`⚠️  ${key} contains placeholder value`)
    }
  }
})

console.log('')

if (warnings.length > 0) {
  console.log('Warnings:')
  warnings.forEach((w) => {
    console.log(w)
  })
  console.log('')
}

if (allPresent) {
  console.log('✅ All required environment variables are set!\n')
  process.exit(0)
} else {
  console.log('❌ Some environment variables are missing!\n')
  process.exit(1)
}
