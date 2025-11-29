-- Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Waste Types Table
CREATE TABLE IF NOT EXISTS waste_types (
  waste_type_id INT AUTO_INCREMENT PRIMARY KEY,
  type_code VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  unit VARCHAR(20) NOT NULL
);

-- Waste Records Table
CREATE TABLE IF NOT EXISTS waste_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  entry_date DATE NOT NULL,
  waste_type_id INT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (waste_type_id) REFERENCES waste_types(waste_type_id),
  INDEX idx_user_date (user_id, entry_date),
  INDEX idx_user_created (user_id, created_at)
);

-- Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  reward_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  points INT DEFAULT 0,
  badge VARCHAR(50) DEFAULT 'STARTER',
  awarded_on DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_points (points)
);

-- Points History Table
CREATE TABLE IF NOT EXISTS points_history (
  ph_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  change INT NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at)
);
