UPDATE travel_note SET cover_image='/images/note1.jpg' WHERE id=1;
UPDATE travel_note SET cover_image='/images/note2.jpg' WHERE id=2;
UPDATE travel_note SET cover_image='/images/note3.jpg' WHERE id=3;
UPDATE travel_note SET cover_image='/images/note4.jpg' WHERE id=4;
UPDATE travel_note SET cover_image='/images/note5.jpg' WHERE id=5;
UPDATE travel_note SET cover_image='/images/note6.jpg' WHERE id=6;

CREATE TABLE IF NOT EXISTS topic (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL,
  description VARCHAR(200), note_count INT DEFAULT 0, follow_count INT DEFAULT 0,
  status TINYINT DEFAULT 1, is_deleted TINYINT DEFAULT 0
) ENGINE=InnoDB CHARSET=utf8mb4;

INSERT IGNORE INTO topic (name,description) VALUES
('苗寨风情','乌东苗寨人文风光'),('美食探店','苗家美食推荐'),
('民宿体验','特色民宿住宿分享'),('节庆活动','苗年节日庆典记录'),
('徒步旅行','梯田徒步路线分享');

INSERT INTO comment (travel_note_id, user_id, content, like_count) VALUES
(1,1,'晨雾中的苗寨真的太美了！我也想去感受一下',3),
(1,2,'照片拍得好有感觉，请问是用什么相机拍的？',2),
(2,1,'看完口水都流下来了，酸汤鱼是我的最爱',5),
(3,2,'苗寨木屋住着真的太治愈了，下次还要去',2),
(5,1,'梯田徒步是我的梦想，这个攻略太实用了',3);
