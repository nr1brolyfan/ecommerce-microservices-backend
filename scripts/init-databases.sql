-- Initialize database for microservices
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create single database for all microservices
CREATE DATABASE microservices_db;

-- Connect to the database
\c microservices_db

-- Create schemas for each microservice
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS products;
CREATE SCHEMA IF NOT EXISTS cart;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS reviews;

-- Grant privileges (optional, postgres user already has full access)
GRANT ALL PRIVILEGES ON DATABASE microservices_db TO postgres;
GRANT ALL ON SCHEMA auth TO postgres;
GRANT ALL ON SCHEMA products TO postgres;
GRANT ALL ON SCHEMA cart TO postgres;
GRANT ALL ON SCHEMA orders TO postgres;
GRANT ALL ON SCHEMA reviews TO postgres;

-- Display schemas
\dn
