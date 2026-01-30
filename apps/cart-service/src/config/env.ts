import 'dotenv/config'

interface Config {
  port: number
  nodeEnv: string
  databaseUrl: string
  jwtSecret: string
  productsServiceUrl: string
  authServiceUrl: string
  logLevel: string
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || '',
  productsServiceUrl: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',
}

// Validation
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required')
}
if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required')
}
