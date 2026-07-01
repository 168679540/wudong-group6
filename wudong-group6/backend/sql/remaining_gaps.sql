-- 房态日历表
CREATE TABLE IF NOT EXISTS room_calendar (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  homestay_id INT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  available_rooms INT DEFAULT 0,
  price DECIMAL(10,2) NULL,
  status TINYINT DEFAULT 1 COMMENT '1=可订 0=不可订',
  UNIQUE KEY uk_home_date(homestay_id, date)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 插入7天种子数据(每个民宿未来7天)
INSERT IGNORE INTO room_calendar (homestay_id, date, available_rooms, price, status) VALUES
(1, CURDATE()+0, 5, 388.00, 1), (1, CURDATE()+1, 3, 388.00, 1), (1, CURDATE()+2, 6, 388.00, 1), (1, CURDATE()+3, 0, 388.00, 0), (1, CURDATE()+4, 4, 388.00, 1), (1, CURDATE()+5, 8, 388.00, 1), (1, CURDATE()+6, 2, 388.00, 1),
(2, CURDATE()+0, 3, 258.00, 1), (2, CURDATE()+1, 4, 258.00, 1), (2, CURDATE()+2, 0, 258.00, 0), (2, CURDATE()+3, 5, 258.00, 1), (2, CURDATE()+4, 3, 258.00, 1), (2, CURDATE()+5, 4, 258.00, 1), (2, CURDATE()+6, 1, 258.00, 1),
(3, CURDATE()+0, 8, 528.00, 1), (3, CURDATE()+1, 10, 528.00, 1), (3, CURDATE()+2, 7, 528.00, 1), (3, CURDATE()+3, 9, 528.00, 1), (3, CURDATE()+4, 6, 528.00, 1), (3, CURDATE()+5, 0, 528.00, 0), (3, CURDATE()+6, 12, 528.00, 1);

-- 电子票列
ALTER TABLE ticket ADD COLUMN e_ticket_code VARCHAR(50) NULL AFTER refund_policy;
ALTER TABLE ticket ADD COLUMN e_ticket_status TINYINT DEFAULT 0 AFTER e_ticket_code COMMENT '0=未核销1=已核销';
