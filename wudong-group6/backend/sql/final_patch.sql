-- 单条执行就不会报错了
ALTER TABLE homestay ADD COLUMN check_in_time VARCHAR(10) DEFAULT '14:00' AFTER amenities;
ALTER TABLE homestay ADD COLUMN check_out_time VARCHAR(10) DEFAULT '12:00' AFTER check_in_time;
ALTER TABLE homestay ADD COLUMN cancellation_policy VARCHAR(500) DEFAULT '入住前3天免费取消，1-3天扣30%，当天不退' AFTER check_out_time;
ALTER TABLE homestay ADD COLUMN dynamic_price DECIMAL(10,2) DEFAULT 0 AFTER price_per_night;
ALTER TABLE ticket ADD COLUMN refund_policy VARCHAR(500) DEFAULT '使用前24小时可退扣10%手续费，24小时内不可退' AFTER description;
ALTER TABLE restaurant ADD COLUMN cancellation_policy VARCHAR(500) DEFAULT '用餐前24小时免费取消，24小时内扣50%' AFTER description;
CREATE TABLE IF NOT EXISTS sensitive_words (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, word VARCHAR(50) NOT NULL, category VARCHAR(20) DEFAULT '其他', status TINYINT DEFAULT 1, is_deleted TINYINT DEFAULT 0) ENGINE=InnoDB CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS user_follow (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, follower_id INT UNSIGNED NOT NULL, following_id INT UNSIGNED NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uk_follow(follower_id,following_id)) ENGINE=InnoDB CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS report (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, reporter_id INT UNSIGNED DEFAULT 1, target_type VARCHAR(20) NOT NULL, target_id INT UNSIGNED NOT NULL, reason VARCHAR(500), status TINYINT DEFAULT 0, handled_by INT UNSIGNED NULL, handle_note VARCHAR(500), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, is_deleted TINYINT DEFAULT 0) ENGINE=InnoDB CHARSET=utf8mb4;
CREATE TABLE IF NOT EXISTS recommended_content (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, title VARCHAR(200), content_type VARCHAR(20), target_id INT UNSIGNED, image_url VARCHAR(255), link_url VARCHAR(255), sort_order INT DEFAULT 0, status TINYINT DEFAULT 1, is_deleted TINYINT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB CHARSET=utf8mb4;
INSERT IGNORE INTO sensitive_words (word,category) VALUES ('违法','政治'),('色情','色情'),('赌博','违法'),('毒品','违法'),('垃圾广告','广告'),('诈骗','违法');
INSERT IGNORE INTO user_follow (follower_id,following_id) VALUES (1,2),(1,3),(2,1),(3,1);
