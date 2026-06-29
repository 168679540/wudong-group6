ALTER TABLE ticket ADD COLUMN rating DECIMAL(2,1) DEFAULT 5.0 AFTER stock;
ALTER TABLE product_review ADD COLUMN ticket_id INT UNSIGNED NULL AFTER restaurant_id;
CREATE TABLE IF NOT EXISTS traffic_guide (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200) NOT NULL,
  origin VARCHAR(100), destination VARCHAR(100), transport_type VARCHAR(50),
  duration VARCHAR(50), cost VARCHAR(100), cover_image VARCHAR(255),
  content TEXT, merchant_id INT UNSIGNED NULL, status TINYINT DEFAULT 1,
  view_count INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

UPDATE ticket SET rating=4.8 WHERE id=1;
UPDATE ticket SET rating=4.3 WHERE id=2;
UPDATE ticket SET rating=4.9 WHERE id=3;
UPDATE ticket SET rating=4.7 WHERE id=4;
UPDATE ticket SET rating=4.5 WHERE id=5;

INSERT INTO product_review (ticket_id,user_id,rating,content) VALUES
(1,1,5,'乌东苗寨太美了门票性价比高景区管理规范'),
(1,2,4,'景区不错但周末人多建议工作日去'),
(3,1,5,'一日游路线安排合理导游讲解很专业'),
(5,2,5,'露营体验超棒星空绝美篝火晚会太嗨了');

INSERT INTO traffic_guide (title,origin,destination,transport_type,duration,cost,content) VALUES
('贵阳→乌东自驾攻略','贵阳','乌东苗寨','自驾','约3.5小时','过路费约80元','从贵阳出发走G60沪昆高速到凯里东出口下'),
('凯里→乌东公交指南','凯里','乌东苗寨','公交+班车','约1.5小时','票价约25元','从凯里客车站乘坐凯里→雷山班车'),
('广州→乌东高铁攻略','广州','乌东苗寨','高铁+自驾','约5小时','高铁票约280元+租车约200元','广州南站乘坐高铁到凯里南站约4小时');
