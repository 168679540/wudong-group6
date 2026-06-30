CREATE TABLE IF NOT EXISTS commission_config (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  module_name VARCHAR(50) NOT NULL UNIQUE,
  rate DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4;

INSERT IGNORE INTO commission_config (module_name, rate) VALUES
('衣·非遗商品', 5.00),
('食·餐饮美食', 10.00),
('住·民宿住宿', 10.00),
('行·线路门票', 10.00);
