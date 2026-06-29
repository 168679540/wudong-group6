-- 农产品表
CREATE TABLE agro_product (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT '茶叶',
  price DECIMAL(10,2) NOT NULL,
  freight DECIMAL(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  cover_image VARCHAR(255),
  specs JSON NULL,
  description TEXT,
  merchant_id INT UNSIGNED NULL,
  status TINYINT DEFAULT 1,
  rating DECIMAL(2,1) DEFAULT 5.0,
  sales INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 餐位时段表
CREATE TABLE meal_slot (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  restaurant_id INT UNSIGNED NOT NULL,
  name VARCHAR(50) NOT NULL,
  start_time VARCHAR(10),
  end_time VARCHAR(10),
  max_bookings INT DEFAULT 20,
  status TINYINT DEFAULT 1,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 农产品种子数据
INSERT INTO agro_product (name,category,price,stock,cover_image,description) VALUES
('贵州高山毛尖','茶叶',128.00,200,'/images/product1.jpg','高山云雾出好茶，贵州高山毛尖，清香回甘'),
('苗家秘制腊肉','腊肉',88.00,150,'/images/product1.jpg','传统烟熏工艺，苗家秘制腊肉，肥瘦相间'),
('乌东糯米酒','米酒',58.00,300,'/images/product1.jpg','苗家自酿糯米酒，甘甜醇厚'),
('苗家酸汤调料','酸食',38.00,500,'/images/product1.jpg','正宗苗家酸汤配方，在家也能做酸汤鱼');

-- 餐位时段种子数据
INSERT INTO meal_slot (restaurant_id,name,start_time,end_time,max_bookings) VALUES
(1,'午餐','11:30','13:30',30),
(1,'晚餐','17:30','20:30',40),
(2,'午宴','12:00','14:00',50),
(2,'晚宴','18:00','21:00',60),
(3,'午餐','11:00','14:00',20),
(3,'晚餐','17:00','20:00',20);

-- 餐厅评价扩展（复用product_review表结构，加restaurant_id）
ALTER TABLE product_review ADD COLUMN restaurant_id INT UNSIGNED NULL AFTER product_id;
