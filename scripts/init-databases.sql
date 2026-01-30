-- Initialize databases for microservices
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create database for Auth Service
CREATE DATABASE auth_db;

-- Create database for Products Service
CREATE DATABASE products_db;

-- Create database for Cart Service
CREATE DATABASE cart_db;

-- Create database for Orders Service
CREATE DATABASE orders_db;

-- Create database for Reviews Service
CREATE DATABASE reviews_db;

-- Grant privileges (optional, postgres user already has full access)
GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE products_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE cart_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE orders_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE reviews_db TO postgres;

-- Display created databases
\l
