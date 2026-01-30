import 'dotenv/config'

interface Config {
  port: number
  nodeEnv: string
  databaseUrl: string
  authServiceUrl: string
  logLevel: string
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'info',
}

// Validation
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL is required')
}
