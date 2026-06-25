-- 乌东文旅平台 - 第6组 平台管理后台 数据库初始化脚本
-- 创建数据库
-- CREATE DATABASE IF NOT EXISTS wudong_admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE wudong_admin;

-- 1. 角色表（RBAC）
CREATE TABLE IF NOT EXISTS `role` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称（如：超级管理员、运营、审核员）',
  `permissions` JSON COMMENT '权限列表（JSON数组）',
  `description` VARCHAR(255) COMMENT '角色描述',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- 2. 管理员账号表
CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '管理员ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '登录用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  `real_name` VARCHAR(50) COMMENT '真实姓名',
  `phone` VARCHAR(20) COMMENT '手机号',
  `email` VARCHAR(100) COMMENT '邮箱',
  `role_id` INT UNSIGNED COMMENT '角色ID',
  `avatar` VARCHAR(255) COMMENT '头像URL',
  `last_login_time` DATETIME COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) COMMENT '最后登录IP',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除',
  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员账号表';

-- 3. 商家入驻申请表
CREATE TABLE IF NOT EXISTS `merchant_application` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '申请ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '申请人用户ID',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module` VARCHAR(20) NOT NULL COMMENT '所属模块：衣/食/住/行',
  `contact_name` VARCHAR(50) COMMENT '联系人姓名',
  `contact_phone` VARCHAR(20) COMMENT '联系人电话',
  `business_license` VARCHAR(255) COMMENT '营业执照图片URL',
  `qualification` VARCHAR(255) COMMENT '资质材料图片URL',
  `status` TINYINT DEFAULT 0 COMMENT '状态：0待审核 1已通过 2已驳回',
  `reject_reason` VARCHAR(500) COMMENT '驳回原因',
  `reviewer_id` INT UNSIGNED COMMENT '审核人ID',
  `review_time` DATETIME COMMENT '审核时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家入驻申请表';

-- 4. 商家账号表
CREATE TABLE IF NOT EXISTS `merchant` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商家ID',
  `user_id` INT UNSIGNED NOT NULL COMMENT '关联的用户ID',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '登录用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module` VARCHAR(20) NOT NULL COMMENT '所属模块：衣/食/住/行',
  `contact_name` VARCHAR(50) COMMENT '联系人',
  `contact_phone` VARCHAR(20) COMMENT '联系电话',
  `address` VARCHAR(255) COMMENT '店铺地址',
  `logo` VARCHAR(255) COMMENT '店铺Logo',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
  `settlement_cycle` VARCHAR(20) DEFAULT 'T+7' COMMENT '结算周期',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商家账号表';

-- 5. 平台公告表
CREATE TABLE IF NOT EXISTS `announcement` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '公告ID',
  `title` VARCHAR(200) NOT NULL COMMENT '公告标题',
  `content` TEXT COMMENT '公告内容',
  `type` VARCHAR(20) DEFAULT 'system' COMMENT '类型：system系统 notice通知 activity活动',
  `is_top` TINYINT DEFAULT 0 COMMENT '是否置顶：0否 1是',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `publish_time` DATETIME COMMENT '发布时间',
  `created_by` INT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台公告表';

-- 6. 首页轮播图表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '轮播图ID',
  `title` VARCHAR(200) COMMENT '标题',
  `image_url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `link_url` VARCHAR(255) COMMENT '跳转链接',
  `sort_order` INT DEFAULT 0 COMMENT '排序号（越小越靠前）',
  `position` VARCHAR(50) DEFAULT 'home' COMMENT '展示位置：home首页',
  `status` TINYINT DEFAULT 1 COMMENT '状态：0下架 1上架',
  `start_time` DATETIME COMMENT '生效开始时间',
  `end_time` DATETIME COMMENT '生效结束时间',
  `created_by` INT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除：0正常 1删除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='首页轮播图表';

-- 插入默认数据
-- 默认超级管理员角色
INSERT INTO `role` (`role_name`, `permissions`, `description`, `status`) VALUES
('超级管理员', '["*"]', '拥有所有权限', 1);

-- 默认管理员账号（密码：admin123，实际应使用bcrypt加密后的值）
INSERT INTO `admin` (`username`, `password`, `real_name`, `role_id`, `status`) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6G', '系统管理员', 1, 1);

-- 默认轮播图
INSERT INTO `banner` (`title`, `image_url`, `link_url`, `sort_order`, `status`) VALUES
('乌东村风景', 'https://example.com/banner1.jpg', '/scenic', 1, 1),
('苗族非遗', 'https://example.com/banner2.jpg', '/product', 2, 1),
('特色美食', 'https://example.com/banner3.jpg', '/food', 3, 1);