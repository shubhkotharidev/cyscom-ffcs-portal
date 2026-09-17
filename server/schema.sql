-- CYSCOM FFCS PORTAL — Neon PostgreSQL Database Schema

-- Drop existing tables if needed
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS contributions CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  reg_no VARCHAR(64) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'member', -- 'member', 'admin', or 'super_admin'
  points INT NOT NULL DEFAULT 0,
  locked BOOLEAN NOT NULL DEFAULT false,
  excluded BOOLEAN NOT NULL DEFAULT false,
  departments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  brief TEXT NOT NULL,
  seats_total INT NOT NULL DEFAULT 1,
  seats_filled INT NOT NULL DEFAULT 0,
  applicants TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submissions Table
CREATE TABLE submissions (
  id VARCHAR(64) PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  reg_no VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  drive_link TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  awarded_points INT,
  reviewed_by VARCHAR(255),
  reviewed_by_email VARCHAR(255),
  submitted_at VARCHAR(32) NOT NULL,
  reviewed_at VARCHAR(32),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contributions History Table
CREATE TABLE contributions (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  date VARCHAR(32) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_users_points ON users (points DESC);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_submissions_status ON submissions (status);
CREATE INDEX idx_submissions_user ON submissions (user_email);
CREATE INDEX idx_contributions_user ON contributions (user_email);
