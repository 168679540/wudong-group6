-- 给新数据库补充缺失的列
ALTER TABLE product_review ADD COLUMN restaurant_id INT UNSIGNED NULL AFTER product_id;
ALTER TABLE product_review ADD COLUMN homestay_id INT UNSIGNED NULL AFTER restaurant_id;
ALTER TABLE product_review ADD COLUMN ticket_id INT UNSIGNED NULL AFTER homestay_id;
ALTER TABLE product_review ADD COLUMN follow_up VARCHAR(500) NULL AFTER reply;
ALTER TABLE product_review MODIFY product_id INT UNSIGNED NULL;
