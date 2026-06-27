-- 乌东文旅平台 - 第6组 平台管理后台 数据库初始化脚本

-- 1. 角色表（RBAC）
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
  `role_name` VARCHAR(100) NOT NULL COMMENT '角色名称',
  `permissions` JSON COMMENT '权限列表',
  `description` VARCHAR(500) COMMENT '角色描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 2. 管理员账号表
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `real_name` VARCHAR(50),
  `phone` VARCHAR(20),
  `email` VARCHAR(100),
  `role_id` INT UNSIGNED,
  `avatar` VARCHAR(255),
  `last_login_time` DATETIME,
  `last_login_ip` VARCHAR(50),
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0,
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账号表';

-- 3. 商家入驻申请表
CREATE TABLE IF NOT EXISTS `merchant_application` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `shop_name` VARCHAR(100) NOT NULL,
  `module` VARCHAR(20) NOT NULL COMMENT '衣/食/住/行',
  `contact_name` VARCHAR(50),
  `contact_phone` VARCHAR(20),
  `business_license` VARCHAR(255),
  `qualification` VARCHAR(255),
  `status` TINYINT DEFAULT 0 COMMENT '0待审核 1已通过 2已驳回',
  `reject_reason` VARCHAR(500),
  `reviewer_id` INT UNSIGNED,
  `review_time` DATETIME,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0,
  FOREIGN KEY (`reviewer_id`) REFERENCES `admin`(`id`)  -- 新增外键
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';

-- 4. 商家账号表
CREATE TABLE IF NOT EXISTS `merchant` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `shop_name` VARCHAR(100) NOT NULL,
  `module` VARCHAR(20) NOT NULL,
  `contact_name` VARCHAR(50),
  `contact_phone` VARCHAR(20),
  `address` VARCHAR(255),
  `logo` VARCHAR(255),
  `status` TINYINT DEFAULT 1,
  `settlement_cycle` VARCHAR(20) DEFAULT 'T+7',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家账号表';

-- 5. 平台公告表
CREATE TABLE IF NOT EXISTS `announcement` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT,
  `type` VARCHAR(20) DEFAULT 'system',
  `is_top` TINYINT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `publish_time` DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 新增默认值
  `created_by` INT UNSIGNED,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='平台公告表';

-- 6. 首页轮播图表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200),
  `image_url` VARCHAR(255) NOT NULL,
  `link_url` VARCHAR(255),
  `sort_order` INT DEFAULT 0,
  `position` VARCHAR(50) DEFAULT 'home',
  `status` TINYINT DEFAULT 1,
  `start_time` DATETIME DEFAULT CURRENT_TIMESTAMP,  -- 新增默认值
  `end_time` DATETIME,  -- 允许NULL，表示永久有效
  `created_by` INT UNSIGNED,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='首页轮播图表';

-- 7. 游客用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nickname` VARCHAR(50) COMMENT '昵称',
  `phone` VARCHAR(20) COMMENT '手机号',
  `avatar` VARCHAR(255) COMMENT '头像',
  `gender` TINYINT DEFAULT 0 COMMENT '0未知 1男 2女',
  `status` TINYINT DEFAULT 1 COMMENT '0禁用 1正常',
  `last_login_time` DATETIME COMMENT '最近登录',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游客用户表';

-- 7. 游记内容表
CREATE TABLE IF NOT EXISTS `travel_note` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL COMMENT '游记标题',
  `content` TEXT COMMENT '游记正文',
  `cover_image` VARCHAR(255) COMMENT '封面图',
  `images` JSON COMMENT '图片列表',
  `author_name` VARCHAR(50) COMMENT '作者昵称',
  `author_id` INT UNSIGNED COMMENT '作者用户ID',
  `location` VARCHAR(100) COMMENT '目的地',
  `view_count` INT DEFAULT 0 COMMENT '浏览量',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `status` TINYINT DEFAULT 0 COMMENT '0待审核 1已发布 2已驳回',
  `reject_reason` VARCHAR(500) COMMENT '驳回原因',
  `reviewer_id` INT UNSIGNED COMMENT '审核人ID',
  `review_time` DATETIME COMMENT '审核时间',
  `publish_time` DATETIME COMMENT '发布时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0,
  FOREIGN KEY (`reviewer_id`) REFERENCES `admin`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记内容表';

-- 8. 全局订单表
CREATE TABLE IF NOT EXISTS `order` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` VARCHAR(20) NOT NULL COMMENT '商品/餐位/住宿/门票/路线',
  `status` TINYINT DEFAULT 0 COMMENT '0待支付 1已支付 2已确认 3已完成 4已取消',
  `amount` DECIMAL(10,2) DEFAULT 0 COMMENT '订单金额',
  `merchant_id` INT UNSIGNED COMMENT '商家ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='全局订单表';

-- 插入默认数据
INSERT INTO `role` (`role_name`, `permissions`, `description`, `status`) VALUES
('超级管理员', '["*"]', '拥有所有权限', 1);

INSERT INTO `admin` (`username`, `password`, `real_name`, `role_id`, `status`) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', '系统管理员', 1, 1);

-- 插入测试游客用户数据
INSERT INTO `user` (`nickname`, `phone`, `avatar`, `gender`, `status`, `created_at`) VALUES
('旅行达人小王', '13800001001', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', 1, 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
('吃货小李', '13800001002', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', 2, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('户外老张', '13800001003', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', 1, 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('文艺小陈', '13800001004', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', 2, 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
('摄影老刘', '13800001005', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5', 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
('背包客阿明', '13800001006', 'https://api.dicebear.com/7.x/avataaars/svg?seed=user6', 1, 0, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- 插入测试游记数据
INSERT INTO `travel_note` (`title`, `content`, `cover_image`, `author_name`, `author_id`, `location`, `view_count`, `like_count`, `status`) VALUES
('乌镇西栅一日游，感受千年水乡韵味', '清晨的西栅笼罩在薄雾中...', 'https://picsum.photos/400/300', '旅行达人小王', 1, '乌镇西栅', 328, 56, 0),
('南浔古镇探店记：藏在巷子里的美食', '沿着青石板路一直走...', 'https://picsum.photos/400/301', '吃货小李', 2, '南浔古镇', 512, 89, 0),
('莫干山民宿体验，远离城市喧嚣', '山路十八弯后终于到达...', 'https://picsum.photos/400/302', '户外老张', 3, '莫干山', 267, 41, 1);

-- 插入测试订单数据
INSERT INTO `order` (`order_no`, `user_id`, `type`, `status`, `amount`, `merchant_id`) VALUES
('WD202606270001', 1, '商品', 0, 268.00, 1),
('WD202606270002', 2, '餐位', 1, 128.00, 2),
('WD202606270003', 3, '住宿', 2, 588.00, 1),
('WD202606270004', 1, '门票', 1, 168.00, NULL),
('WD202606270005', 2, '路线', 3, 998.00, NULL),
('WD202606270006', 4, '商品', 0, 358.00, 3),
('WD202606270007', 5, '餐位', 1, 88.00, 2);

-- 插入测试商家申请数据
INSERT INTO `merchant_application` (`user_id`, `shop_name`, `module`, `contact_name`, `contact_phone`, `status`) VALUES
(1, '苗绣非遗工坊', '衣', '张师傅', '13900001001', 0),
(2, '乌东苗家酸汤鱼', '食', '李老板', '13900001002', 0),
(3, '苗寨观景民宿', '住', '王掌柜', '13900001003', 0),
(4, '乌东梯田旅行社', '行', '陈经理', '13900001004', 1),
(5, '银饰手工坊', '衣', '刘师傅', '13900001005', 2);

-- 插入测试商家数据
INSERT INTO `merchant` (`user_id`, `username`, `password`, `shop_name`, `module`, `contact_name`, `contact_phone`, `status`, `settlement_cycle`) VALUES
(1, 'miaoxiu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', '苗绣非遗工坊', '衣', '张师傅', '13900001001', 1, 'T+7'),
(2, 'suantangyu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', '乌东苗家酸汤鱼', '食', '李老板', '13900001002', 1, 'T+3'),
(3, 'miaozhaiminsu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', '苗寨观景民宿', '住', '王掌柜', '13900001003', 1, 'T+7');

-- 插入测试公告数据
INSERT INTO `announcement` (`title`, `content`, `type`, `is_top`, `status`, `publish_time`, `created_by`) VALUES
('关于乌东文旅平台正式上线的通知', '乌东文旅"衣食住行"综合服务平台已于2026年6月正式上线运行...', 'system', 1, 1, NOW(), 1),
('端午节平台运营公告', '端午节期间（6月20日-6月22日），平台正常运营...', 'notice', 1, 1, NOW(), 1),
('商家入驻流程说明', '欢迎各位商家入驻乌东文旅平台，请按照以下流程提交申请...', 'guide', 0, 1, NOW(), 1);

-- 插入测试轮播图数据
INSERT INTO `banner` (`title`, `image_url`, `link_url`, `sort_order`, `position`, `status`) VALUES
('乌东苗寨欢迎您', 'https://picsum.photos/800/300?random=1', 'https://wudong.example.com', 0, 'home', 1),
('非遗苗绣限时特惠', 'https://picsum.photos/800/300?random=2', 'https://wudong.example.com/clothing', 1, 'home', 1),
('苗家美食节', 'https://picsum.photos/800/300?random=3', 'https://wudong.example.com/food', 2, 'home', 1);

-- ============================================
-- 以下为前5个业务模块的数据库表与种子数据
-- ============================================

-- 第1组：衣——非遗商品表
CREATE TABLE IF NOT EXISTS `product` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `category` VARCHAR(50) DEFAULT '银饰' COMMENT '分类：银饰/蜡染/刺绣/服饰/其他',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `cover_image` VARCHAR(255) COMMENT '封面图',
  `images` JSON COMMENT '图片列表',
  `description` TEXT COMMENT '商品描述',
  `merchant_id` INT UNSIGNED COMMENT '商家ID',
  `status` TINYINT DEFAULT 1 COMMENT '0下架 1上架',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='非遗商品表';

-- 第2组：食——餐厅表
CREATE TABLE IF NOT EXISTS `restaurant` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL COMMENT '餐厅名称',
  `cover_image` VARCHAR(255) COMMENT '封面图',
  `address` VARCHAR(255) COMMENT '地址',
  `avg_price` DECIMAL(10,2) DEFAULT 0 COMMENT '人均价格',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `description` TEXT COMMENT '餐厅描述',
  `merchant_id` INT UNSIGNED COMMENT '商家ID',
  `status` TINYINT DEFAULT 1 COMMENT '0休息 1营业',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 第3组：住——民宿表
CREATE TABLE IF NOT EXISTS `homestay` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL COMMENT '民宿名称',
  `cover_image` VARCHAR(255) COMMENT '封面图',
  `address` VARCHAR(255) COMMENT '地址',
  `price_per_night` DECIMAL(10,2) NOT NULL COMMENT '每晚价格',
  `room_count` INT DEFAULT 1 COMMENT '房间数',
  `amenities` VARCHAR(255) COMMENT '设施：WiFi/空调/停车场',
  `description` TEXT COMMENT '民宿描述',
  `merchant_id` INT UNSIGNED COMMENT '商家ID',
  `status` TINYINT DEFAULT 1 COMMENT '0关闭 1营业',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 第4组：行——门票/路线表
CREATE TABLE IF NOT EXISTS `ticket` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL COMMENT '门票/路线名称',
  `type` VARCHAR(20) NOT NULL COMMENT '门票/路线',
  `cover_image` VARCHAR(255) COMMENT '封面图',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 9999 COMMENT '库存',
  `description` TEXT COMMENT '描述',
  `merchant_id` INT UNSIGNED COMMENT '商家ID',
  `status` TINYINT DEFAULT 1 COMMENT '0下架 1上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门票路线表';

-- 第5组：社区——游记（已有travel_note表），补评论表
CREATE TABLE IF NOT EXISTS `comment` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `travel_note_id` INT UNSIGNED NOT NULL COMMENT '游记ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `content` VARCHAR(500) NOT NULL COMMENT '评论内容',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` TINYINT DEFAULT 0,
  FOREIGN KEY (`travel_note_id`) REFERENCES `travel_note`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记评论表';

-- ============ 插入测试数据 ============

-- 商品数据
INSERT INTO `product` (`name`, `category`, `price`, `stock`, `cover_image`, `description`, `merchant_id`, `status`, `sales`) VALUES
('苗族手工银饰吊坠', '银饰', 368.00, 50, 'https://picsum.photos/400/300?random=10', '纯手工打造苗族传统银饰吊坠，采用传统银饰锻造工艺，每件独一无二', 1, 1, 128),
('苗族蜡染方巾', '蜡染', 168.00, 100, 'https://picsum.photos/400/300?random=11', '天然植物染料，手工蜡染技艺，苗族传统吉祥纹样', 1, 1, 256),
('苗族刺绣手包', '刺绣', 258.00, 30, 'https://picsum.photos/400/300?random=12', '精工苗族刺绣手包，一针一线手工缝制，融合现代设计与传统纹样', 1, 1, 89),
('苗族银手镯', '银饰', 588.00, 20, 'https://picsum.photos/400/300?random=13', '苗族传统银手镯，繁复花纹锻造，佩戴舒适大方', 5, 1, 45),
('苗族服饰上衣', '服饰', 888.00, 15, 'https://picsum.photos/400/300?random=14', '传统苗族女式上衣，手工织锦面料，节日盛装', 5, 1, 32),
('苗族银耳环', '银饰', 198.00, 80, 'https://picsum.photos/400/300?random=15', '苗族特色银耳环，小巧精致，日常百搭', 5, 1, 156);

-- 餐厅数据
INSERT INTO `restaurant` (`name`, `cover_image`, `address`, `avg_price`, `rating`, `description`, `merchant_id`, `status`) VALUES
('乌东苗家酸汤鱼', 'https://picsum.photos/400/300?random=20', '乌东村中心街12号', 68.00, 4.8, '苗家正宗酸汤鱼，秘制酸汤锅底，新鲜河鱼，长桌宴体验', 2, 1),
('苗寨长桌宴', 'https://picsum.photos/400/300?random=21', '乌东村鼓楼广场旁', 128.00, 4.9, '体验苗族最高待客礼仪——长桌宴，含十二道苗家特色菜肴', 2, 1),
('山里人家农家菜', 'https://picsum.photos/400/300?random=22', '乌东村西入口', 45.00, 4.5, '地道农家小炒，自家种蔬菜散养土鸡，健康美味', 2, 1);

-- 民宿数据
INSERT INTO `homestay` (`name`, `cover_image`, `address`, `price_per_night`, `room_count`, `amenities`, `description`, `merchant_id`, `status`) VALUES
('苗寨观景民宿', 'https://picsum.photos/400/300?random=30', '乌东村半山腰', 388.00, 8, 'WiFi,空调,停车场,观景台', '坐落于苗寨半山，推开窗便是千户苗寨全景，日出日落尽收眼底', 3, 1),
('梯田木屋客栈', 'https://picsum.photos/400/300?random=31', '乌东村梯田景区入口', 258.00, 5, 'WiFi,停车场,厨房', '原生态木屋，紧邻梯田景区，清晨被鸟鸣唤醒，夜晚枕星空入眠', 3, 1),
('鼓楼精品客栈', 'https://picsum.photos/400/300?random=32', '乌东村鼓楼旁', 528.00, 12, 'WiFi,空调,停车场,餐厅,会议室', '核心地段精品客栈，步行1分钟到鼓楼广场，苗式装修风格', 3, 1);

-- 门票/路线数据
INSERT INTO `ticket` (`name`, `type`, `cover_image`, `price`, `stock`, `description`, `merchant_id`, `status`) VALUES
('乌东苗寨景区门票', '门票', 'https://picsum.photos/400/300?random=40', 80.00, 9999, '乌东苗寨景区成人门票，含鼓楼、风雨桥、苗族博物馆', 4, 1),
('梯田观光门票', '门票', 'https://picsum.photos/400/300?random=41', 50.00, 9999, '千亩梯田景区门票，最佳观赏季节5-10月', 4, 1),
('苗寨一日游路线', '路线', 'https://picsum.photos/400/300?random=42', 298.00, 500, '含门票+导游+苗家长桌宴午餐，全程6小时', 4, 1),
('非遗体验两日游', '路线', 'https://picsum.photos/400/300?random=43', 688.00, 300, '含住宿+银饰/蜡染/刺绣三项非遗手工体验+全程导游', 4, 1),
('露营星空两日游', '路线', 'https://picsum.photos/400/300?random=44', 498.00, 200, '梯田露营+篝火晚会+苗家烧烤+次日日出观景', 4, 1);

-- 评论数据
INSERT INTO `comment` (`travel_note_id`, `user_id`, `content`, `like_count`) VALUES
(1, 2, '写得真好！我也想去西栅看看', 12),
(1, 3, '请问住宿有推荐的吗？', 5),
(2, 1, '南浔的小吃真的绝了，上周刚去过', 8),
(3, 2, '莫干山真的是江浙沪后花园，推荐大家去', 15),
(3, 4, '照片拍得太美了！用的什么相机？', 6);
