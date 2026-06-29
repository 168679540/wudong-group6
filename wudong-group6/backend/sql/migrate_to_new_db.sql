-- 新数据库迁移脚本（192.168.122.145）
-- 缺少的表：agro_product, agro_category, product_category, meal_slot 已存在则跳过

-- 农产品表
CREATE TABLE IF NOT EXISTS agro_product (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT '茶叶', price DECIMAL(10,2) NOT NULL,
  freight DECIMAL(10,2) DEFAULT 0, stock INT DEFAULT 0,
  cover_image VARCHAR(255), specs JSON NULL, description TEXT, origin VARCHAR(255) NULL,
  merchant_id INT UNSIGNED NULL, status TINYINT DEFAULT 1,
  rating DECIMAL(2,1) DEFAULT 5.0, sales INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 农产品分类表
CREATE TABLE IF NOT EXISTS agro_category (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL, sort_order INT DEFAULT 0, status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 商品分类表
CREATE TABLE IF NOT EXISTS product_category (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL, sort_order INT DEFAULT 0, status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

-- product_review 加 restaurant_id 列（如果不存在）
ALTER TABLE product_review ADD COLUMN IF NOT EXISTS restaurant_id INT UNSIGNED NULL AFTER product_id;
ALTER TABLE product_review ADD COLUMN IF NOT EXISTS follow_up VARCHAR(500) NULL AFTER reply;
ALTER TABLE product_review MODIFY product_id INT UNSIGNED NULL;

-- 种子数据：农产品
INSERT IGNORE INTO agro_product (name,category,price,stock,cover_image,description,origin) VALUES
('贵州高山毛尖','茶叶',128.00,200,'/images/agro1.jpg','高山云雾出好茶，贵州高山毛尖，清香回甘','贵州黔东南乌东村高山茶园'),
('苗家秘制腊肉','腊肉',88.00,150,'/images/agro2.jpg','传统烟熏工艺，苗家秘制腊肉，肥瘦相间','乌东苗寨传统烟熏工坊'),
('乌东糯米酒','米酒',58.00,300,'/images/agro3.jpg','苗家自酿糯米酒，甘甜醇厚','乌东苗家自酿作坊'),
('苗家酸汤调料','酸食',38.00,500,'/images/agro4.jpg','正宗苗家酸汤配方，在家也能做酸汤鱼','乌东苗家传统发酵工坊');

-- 种子数据：分类
INSERT IGNORE INTO agro_category (name,sort_order) VALUES ('茶叶',1),('腊肉',2),('米酒',3),('酸食',4),('其他',5);
INSERT IGNORE INTO product_category (name,sort_order) VALUES ('银饰',1),('蜡染',2),('刺绣',3),('服饰',4),('其他',5);

-- 种子数据：餐厅评价
INSERT IGNORE INTO product_review (restaurant_id,user_id,rating,content) VALUES
(1,1,5,'酸汤鱼太正宗了！汤底酸辣鲜香鱼肉嫩滑'),
(1,2,4,'环境很有苗寨特色服务热情'),
(2,1,5,'长桌宴太震撼了十二道菜摆满长桌'),
(3,2,4,'农家菜味道朴实好吃价格实惠');
