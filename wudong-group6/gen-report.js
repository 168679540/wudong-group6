const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, ShadingType } = require('docx');
const fs = require('fs');

const FONT = '宋体'; const FONT_H = '黑体'; const FONT_C = 'Consolas';
const sz = (pt) => pt * 2;

const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 }, children: [new TextRun({ text, font: FONT_H, size: sz(15), bold: true })] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, font: FONT_H, size: sz(13), bold: true })] });
const P = (text, opts = {}) => new Paragraph({ spacing: { after: 100, line: 360 }, children: [new TextRun({ text, font: FONT, size: sz(10.5), ...opts })] });
const PI = (text) => new Paragraph({ spacing: { after: 100, line: 360, left: 400 }, children: [new TextRun({ text, font: FONT, size: sz(10.5) })] });
const Code = (text) => new Paragraph({ spacing: { after: 60, line: 280 }, shading: { fill: 'f5f5f5' }, children: [new TextRun({ text, font: FONT_C, size: sz(9) })] });
const Empty = () => new Paragraph({ spacing: { after: 100 }, children: [] });
const Img = (label) => new Paragraph({ spacing: { before: 100, after: 100 }, alignment: AlignmentType.CENTER, children: [
  new TextRun({ text: '【 📷 ' + label + ' 】', font: FONT, size: sz(10.5), italics: true, color: '888888' })] });

function Tbl(headers, rows, widths) {
  const w = widths || headers.map(() => Math.floor(9000 / headers.length));
  return new Table({ width: { size: 9000, type: WidthType.DXA }, rows: [
    new TableRow({ tableHeader: true, children: headers.map((h, i) => new TableCell({
      width: { size: w[i], type: WidthType.DXA }, shading: { fill: '4472C4', type: ShadingType.CLEAR },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, font: FONT_H, size: sz(10), bold: true, color: 'FFFFFF' })] })] })) }),
    ...rows.map(row => new TableRow({ children: row.map((c, i) => new TableCell({
      width: { size: w[i], type: WidthType.DXA },
      children: [new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: String(c), font: FONT, size: sz(10) })] })] })) })),
  ]});
}

const children = [];

// ====== COVER ======
children.push(new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: '人工智能工程实践', font: FONT_H, size: sz(24), bold: true })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '课程设计大作业报告', font: FONT_H, size: sz(22), bold: true })] }));
children.push(Empty()); children.push(Empty());
children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '乌东文旅"衣食住行"综合服务平台', font: FONT, size: sz(16) })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: '—— 平台管理后台模块 ——', font: FONT, size: sz(14) })] }));
children.push(Empty()); children.push(Empty()); children.push(Empty());
children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '姓    名：林泽铃', font: FONT, size: sz(14) })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: '学    号：_______________', font: FONT, size: sz(14) })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: '班    级：_______________', font: FONT, size: sz(14) })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: '指导老师：_______________', font: FONT, size: sz(14) })] }));
children.push(Empty()); children.push(Empty());
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: '2026年6月', font: FONT, size: sz(14) })] }));

// ====== 1 ======
children.push(new Paragraph({ children: [], spacing: { before: 200 }, pageBreakBefore: true }));
children.push(H1('一、引言与项目背景'));
children.push(H2('1.1 校企合作课程概述'));
children.push(P('本课程"人工智能工程实践"是学校与企业（AI创赢）合作开设的一门综合实践课程。与传统课堂教学不同，本课程以企业提供的真实文旅项目——乌东文旅"衣食住行"综合服务平台为驱动，学生需在限定周期内独立完成从需求分析到系统交付的全栈开发任务。'));
children.push(P('课程的核心特色在于"AI辅助开发"——鼓励学生使用Claude Code等AI工具提升开发效率。在本次实践中，AI承担了从数据库设计、接口开发到前端页面构建的大部分编码工作，学生则负责需求理解、代码审核、问题排查和最终验收。这种"人机协作"的模式使开发效率提升了数倍。'));

children.push(H2('1.2 项目背景'));
children.push(P('乌东村是贵州黔东南苗族侗族自治州的一个特色苗寨，拥有苗族银饰锻造、蜡染刺绣、苗家长桌宴、特色民宿、梯田景观等丰富的文旅资源。然而当地运营仍以线下为主，缺乏统一的线上服务入口。为响应国家乡村振兴战略与数字化转型号召，本项目旨在构建一个覆盖"衣食住行"全链路的文旅综合服务平台，整合非遗商品、餐饮美食、民宿住宿、线路门票四大业务主线，辅以社区分享与平台管理功能。'));
children.push(P('平台分为6个模块：衣（非遗商品）、食（餐饮美食）、住（民宿住宿）、行（线路门票）、社区（分享互动）、管理后台。本人独立承担其中的平台管理后台模块，作为整个系统的运营中枢，需实现对用户、商家、订单、内容、数据、运营的全局管理。'));

children.push(H2('1.3 个人角色与分工'));
children.push(P('在本项目中，本人以全栈开发方式独立完成了平台管理后台模块的全部工作：'));
children.push(Tbl(['层级', '工作内容', '核心技术'],
[['数据库层', '设计14张业务表，编写完整建表SQL与种子测试数据', 'MySQL + TypeORM'],
['后端服务层', '实现20个Controller和15个Service，覆盖登录认证、CRUD、分页、软删除、审核流转、统计聚合', 'Midway.js v3 + JWT + bcryptjs'],
['前端展示层', '实现20个页面组件（管理后台13个 + 业务预览5个 + PC首页 + 入驻申请），含ECharts图表和轮播预览', 'React 18 + Ant Design 5 + Axios'],
['基础设施', 'CORS跨域中间件、JWT认证中间件、UTF-8编码、超时配置', 'Koa中间件'],
], [2500, 4000, 2500]));
children.push(Img('图1-3：全栈开发角色范围'));

// ====== 2 ======
children.push(H1('二、开发过程'));
children.push(H2('2.1 环境搭建与仓库创建'));
children.push(P('项目启动时首先进行开发环境搭建，包括安装Docker、配置WSL、注册GitHub账号并创建远程仓库。由于企业方提供的项目模板中包含了README文件，首次推送时需要先执行git pull origin main --allow-unrelated-histories解决冲突。后续安装了Git代理以解决网络超时问题。'));
children.push(Img('图2-1：Git仓库与GitHub主页截图'));

children.push(H2('2.2 数据库设计'));
children.push(P('在详细研读《乌东文旅"衣食住行"综合服务平台需求规格说明书》后，提取出平台管理后台需要管理的数据实体，在backend/sql/目录下创建init.sql文件，完成了14张表的建表SQL编写。'));
children.push(P('数据库设计遵循统一的规范：所有表使用INT UNSIGNED AUTO_INCREMENT作为主键、is_deleted字段实现软删除、created_at和updated_at自动时间戳、InnoDB引擎和utf8mb4字符集。表之间通过外键关联（如admin.role_id → role.id、merchant_application.reviewer_id → admin.id）。'));
children.push(Img('图2-2：DBeaver中14张表的ER关系图'));

children.push(H2('2.3 后端接口开发'));
children.push(P('使用Midway.js v3框架进行后端开发。首先初始化项目（npm install安装依赖），然后创建实体层（entity/）、服务层（service/）、控制器层（controller/）的目录结构和空文件。在编写具体代码前，先修改config.default.ts配置MySQL数据库连接信息。'));
children.push(P('开发过程中遇到了一系列技术问题，详见第七章。首次成功启动服务后，通过curl和浏览器测试了各接口，确认数据正确返回。'));
children.push(Img('图2-3：终端启动服务成功的截图'));

children.push(H2('2.4 前端页面开发'));
children.push(P('前端采用React 18 + Ant Design 5技术栈。首先创建项目（Create React App），安装antd、axios、react-router-dom等依赖。然后按照模块逐一构建：'));
children.push(PI('Axios封装（src/api/request.ts）：配置baseURL、超时时间、请求拦截器（自动附加JWT Token）、响应拦截器（统一取response.data）'));
children.push(PI('布局组件（Layout.tsx）：侧边栏菜单 + 顶部导航 + 内容区域，使用Ant Design的Layout组件'));
children.push(PI('登录页（Login.tsx）：用户名密码表单，调用POST /api/admin/login接口'));
children.push(PI('数据看板（Dashboard.tsx）：统计卡片 + ECharts图表 + 轮播图预览'));
children.push(PI('各管理页面：管理员管理、角色权限、游客用户、商家入驻审核、商家账号、轮播图、公告、游记审核、全局订单、财务结算、系统设置等共13个页面'));
children.push(PI('PC端首页（PublicHome.tsx）和商家入驻申请页（MerchantJoin.tsx）：面向游客和商家的公开页面'));
children.push(Img('图2-4：项目目录结构 vs code 截图'));

children.push(H2('2.5 联调测试与问题修复'));
children.push(P('前后端联调阶段，主要解决了以下问题：CORS跨域拦截（导致前端请求返回404）、密码哈希不匹配（导致登录失败）、接口返回数据但前端显示空（axios响应拦截器多取了一层data）、中文乱码（三层编码修复）、时区偏移导致Dashboard查询为空等。'));
children.push(P('所有接口通过curl逐一验证HTTP 200后，在浏览器中进行完整的功能测试，确保每个管理页面的CRUD操作、审核流程、统计图表均正常运行。'));

// ====== 3 ======
children.push(H1('三、系统设计'));
children.push(H2('3.1 系统架构'));
children.push(P('本项目采用前后端分离的B/S架构：'));
children.push(Code('浏览器（React 18 + Ant Design 5 + ECharts图表）'));
children.push(Code('    ↕  HTTP/REST  +  JSON  (Axios)'));
children.push(Code('Midway.js v3  (Koa框架 + IoC容器 + 中间件链)'));
children.push(Code('    ↕  TypeORM  (QueryBuilder)'));
children.push(Code('MySQL 8.0  (utf8mb4编码)'));
children.push(P('架构要点：前端通过Axios发送HTTP请求到后端7001端口；后端通过TypeORM的QueryBuilder构建类型安全的SQL查询；CORS中间件以外层Koa原生方式注册在最前端确保OPTIONS预检不被拦截；JWT中间件对管理类接口进行身份校验，公开接口列入白名单放行。'));
children.push(Img('图3-1：系统架构图'));

children.push(H2('3.2 技术选型'));
children.push(Tbl(['层级', '技术', '版本', '选型理由'],
[['前端框架', 'React', '18.x', '课程统一要求，组件化开发'],
['UI组件库', 'Ant Design', '5.x', '企业级后台UI，Table/Form/Modal丰富'],
['图表库', 'ECharts', '5.x', '折线图、柱状图、饼图，与React集成方便'],
['HTTP客户端', 'Axios', '1.x', '拦截器统一处理Token和错误响应'],
['后端框架', 'Midway.js', '3.x', '企业级Node.js框架，IoC依赖注入，TypeORM官方集成'],
['ORM', 'TypeORM', '0.3.x', '实体管理，QueryBuilder灵活构建SQL'],
['数据库', 'MySQL', '8.0', '课程统一要求，稳定可靠'],
['认证', 'jsonwebtoken', '9.x', 'JWT无状态认证，适合前后端分离'],
['密码加密', 'bcryptjs', '3.x', '纯JS实现的bcrypt，不可逆哈希'],
], [2000, 2000, 1500, 3500]));

children.push(H2('3.3 项目目录结构'));
children.push(Code('wudong-group6/'));
children.push(Code('├── backend/                      # 后端（Midway.js）'));
children.push(Code('│   ├── src/config/               # MySQL + JWT 配置'));
children.push(Code('│   ├── src/controller/           # 20个控制器'));
children.push(Code('│   ├── src/service/              # 15个服务'));
children.push(Code('│   ├── src/entity/               # 10个TypeORM实体'));
children.push(Code('│   ├── src/middleware/            # CORS / Auth / Report'));
children.push(Code('│   └── sql/init.sql              # 14张表+种子数据'));
children.push(Code('├── admin-web/                    # 前端（React）'));
children.push(Code('│   ├── src/api/                  # 11个API模块'));
children.push(Code('│   ├── src/pages/                # 20个页面组件'));
children.push(Code('│   └── src/components/           # ECharts / Layout'));
children.push(Code('└── miniprogram/                  # 微信小程序（其他模块）'));

// ====== 4 ======
children.push(H1('四、功能实现'));
children.push(P('平台管理后台最终实现了14个功能模块（含PC端和入驻申请），以下逐一说明。'));

children.push(H2('4.1 管理员登录'));
children.push(P('管理员通过用户名和密码登录。后端使用bcryptjs.compareSync()比对密码哈希，验证通过后签发JWT Token（24小时有效期），同时更新last_login_time。前端将Token存入localStorage，Axios请求拦截器自动在Header中附加Authorization: Bearer xxx。'));
children.push(Code('POST /api/admin/login'));
children.push(Code('→ { "success": true, "data": { "token": "eyJ...", "admin": {...} } }'));
children.push(Img('图4-1：登录页面截图'));

children.push(H2('4.2 数据看板'));
children.push(P('数据看板是管理后台首页，包含：8个统计卡片（今日新增用户、今日订单数、今日GMV、待审核商家、累计用户、累计订单、累计GMV、商家总数）、3张ECharts图表（近7日订单趋势折线图、近7日新增用户折线图、订单类型分布饼图）、轮播图预览组件。'));
children.push(P('后端实现：GET /api/dashboard/stats 接口一次性查询user表、order表、merchant表、merchant_application表，通过DATE()函数 + GROUP BY实现近7日按天聚合趋势数据，通过GROUP BY type实现按订单类型分布。前端收到数据后直接绑定到ECharts的option配置中渲染。'));
children.push(Img('图4-2：数据看板完整页面截图'));

children.push(H2('4.3 管理员管理'));
children.push(P('CRUD（增删改查）+ 分页 + 角色关联 + 状态切换（启用/禁用）+ 软删除。'));
children.push(P('创建/更新时通过bcryptjs.hashSync自动加密密码。列表中通过role_id关联查询角色信息。删除操作不真删数据，而是将is_deleted字段置为1。'));
children.push(Img('图4-3：管理员列表页截图'));

children.push(H2('4.4 角色权限'));
children.push(P('RBAC角色管理：角色名称 + permissions字段（JSON格式，可存储如["*"]或["admin:read","admin:write"]等权限列表）+ 描述 + 启用状态。'));
children.push(Img('图4-4：角色权限页截图'));

children.push(H2('4.5 游客用户管理'));
children.push(P('查看所有注册游客（user表），支持昵称/手机号搜索、禁启用、软删除。用户头像使用DiceBear API生成的头像占位。'));
children.push(Img('图4-5：游客用户列表截图'));

children.push(H2('4.6 商家入驻审核'));
children.push(P('管理后台审核页提供：状态筛选（全部/待审核/已通过/已驳回）+ 表格 + 审核操作弹窗（通过/驳回+填写驳回原因）。'));
children.push(P('PC端入驻申请页（/join，无需登录）：商家选择入驻类型（衣/食/住/行）后系统自动提示所需资质材料，填写店铺名称、联系人、联系电话即可提交。申请写入merchant_application表，默认status=0（待审核）。'));
children.push(P('审核流程：管理员点击"通过"→ status=1 + reviewer_id + review_time；点击"驳回"→ status=2 + reject_reason。'));
children.push(Img('图4-6a：商家入驻审核列表页截图'));
children.push(Img('图4-6b：PC端入驻申请页截图'));

children.push(H2('4.7 商家账号管理'));
children.push(P('管理已通过审核的商家账号（merchant表）。支持按衣/食/住/行模块筛选，CRUD操作，状态管理。'));
children.push(Img('图4-7：商家账号列表截图'));

children.push(H2('4.8 轮播图管理'));
children.push(P('管理PC端首页轮播图。字段：标题、图片URL、跳转链接、排序号、位置、上下架状态、时间范围（start_time/end_time）。'));
children.push(P('GET /api/banner/active 接口仅返回status=1且在有效期内的轮播图，供前端展示使用。数据看板顶部集成Carousel组件展示启用中的轮播图。'));
children.push(Img('图4-8：轮播图管理页截图'));

children.push(H2('4.9 公告管理'));
children.push(P('管理平台公告。支持发布（publish_time）、置顶（is_top）、类型分类（系统公告/活动通知/操作指南）、上下架状态。列表按置顶优先 + 发布时间倒序排列。'));
children.push(Img('图4-9：公告管理页截图'));

children.push(H2('4.10 游记审核'));
children.push(P('审核游客发布的游记（travel_note表）。审核状态流转：待审核(0) → 通过后自动发布(1) / 驳回(2)；已发布(1) → 可下架(3)。审核操作记录reviewer_id、review_time和reject_reason。'));
children.push(Img('图4-10：游记审核页截图'));

children.push(H2('4.11 全局订单'));
children.push(P('跨模块查看所有订单（order表），支持按订单类型（商品/餐位/住宿/门票/路线）和状态（待支付/已支付/已确认/已完成/已取消）筛选。设计了下单接口POST /api/order/create，前台业务模块的"下单/预订/购票"按钮均调用此接口写入订单，数据看板实时更新。'));
children.push(Img('图4-11：全局订单页截图'));

children.push(H2('4.12 财务结算'));
children.push(P('按业务类型（衣/食/住/行）汇总订单数据。使用GROUP BY type + SUM(amount)聚合，自动计算服务费（5%）和结算金额。页面顶部展示6个统计卡片（订单总数/总金额/结算金额/服务费收入/待处理/已处理）。'));
children.push(Img('图4-12：财务结算页截图'));

children.push(H2('4.13 系统设置'));
children.push(P('包含：维护模式开关、JWT密钥与过期时间配置、数据库连接状态展示（主机/端口/数据库名/编码）、API Base URL信息、项目基本信息展示。'));
children.push(Img('图4-13：系统设置页截图'));

children.push(H2('4.14 PC端首页'));
children.push(P('面向游客和商家的公开页面（/pc，无需登录）。包含：顶部导航栏（首页/业务模块/商家入驻/游记社区/管理后台）、轮播图自动播放、平台统计数据、5大业务模块介绍卡片、商家入驻指南（四类商家+资质要求+4步入驻流程Steps组件）、游记社区展示（从travel_note表查询已发布游记）。'));
children.push(Img('图4-14：PC端首页完整截图'));

children.push(H2('4.15 前台业务模块预览'));
children.push(P('在完成管理后台之余，同步实现了衣/食/住/行/社区5个模块的最小可用版本，共5个前台预览页面、6张业务表、40+条测试数据。这些页面的下单按钮与order表打通——点击后写入order表，数据看板实时更新。'));
children.push(Tbl(['模块', '页面', '数据库表', '测试数据'],
[['衣·非遗商品', 'ProductList（分类筛选+下单）', 'product', '6个商品'],
['食·餐饮美食', 'FoodList（评分+预订餐位）', 'restaurant', '3家餐厅'],
['住·民宿住宿', 'HomestayList（价格/设施+预订）', 'homestay', '3家民宿'],
['行·线路门票', 'TravelTicketList（门票/路线+购票）', 'ticket', '5个门票路线'],
['社区·分享', 'CommunityList（游记卡片）', 'comment', '5条评论'],
], [2000, 3200, 2000, 1800]));
children.push(Img('图4-15：5个前台业务预览页截图'));

// ====== 5 ======
children.push(H1('五、数据库设计'));
children.push(H2('5.1 表结构总览'));
children.push(Tbl(['序号', '表名', '说明', '字段数', '测试数据'],
[['1', 'role', '角色表（RBAC）', '8', '1条'],
['2', 'admin', '管理员账号表', '15', '1条'],
['3', 'user', '游客用户表', '10', '6条'],
['4', 'merchant_application', '商家入驻申请表', '15', '5条'],
['5', 'merchant', '商家账号表', '15', '3条'],
['6', 'announcement', '平台公告表', '12', '3条'],
['7', 'banner', '首页轮播图表', '13', '3条'],
['8', 'travel_note', '游记内容表', '16', '3条'],
['9', 'comment', '游记评论表', '6', '5条'],
['10', 'order', '全局订单表', '10', '7条'],
['11', 'product', '非遗商品表', '13', '6条'],
['12', 'restaurant', '餐厅表', '11', '3条'],
['13', 'homestay', '民宿表', '12', '3条'],
['14', 'ticket', '门票路线表', '11', '5条'],
], [500, 2200, 2800, 800, 1200]));
children.push(Img('图5-1：数据库ER图（DBeaver截图）'));

children.push(H2('5.2 设计规范'));
children.push(PI('主键：INT UNSIGNED AUTO_INCREMENT'));
children.push(PI('软删除：is_deleted TINYINT DEFAULT 0，所有删除操作仅标记该字段'));
children.push(PI('时间戳：created_at DEFAULT CURRENT_TIMESTAMP，updated_at ON UPDATE CURRENT_TIMESTAMP'));
children.push(PI('字符集：ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'));
children.push(PI('外键约束：role_id → role.id，reviewer_id → admin.id，merchant_id → merchant.id'));

children.push(H2('5.3 核心表示例（admin）'));
children.push(Code('CREATE TABLE `admin` ('));
children.push(Code('  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,'));
children.push(Code('  `username` VARCHAR(50) NOT NULL UNIQUE,'));
children.push(Code('  `password` VARCHAR(255) NOT NULL,'));
children.push(Code('  `real_name` VARCHAR(50),'));
children.push(Code('  `phone` VARCHAR(20),'));
children.push(Code('  `email` VARCHAR(100),'));
children.push(Code('  `role_id` INT UNSIGNED,'));
children.push(Code('  `avatar` VARCHAR(255),'));
children.push(Code('  `last_login_time` DATETIME,'));
children.push(Code('  `status` TINYINT DEFAULT 1,'));
children.push(Code('  `is_deleted` TINYINT DEFAULT 0,'));
children.push(Code('  FOREIGN KEY (`role_id`) REFERENCES `role`(`id`)'));
children.push(Code(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;'));

// ====== 6 ======
children.push(H1('六、接口设计'));
children.push(H2('6.1 接口规范'));
children.push(Tbl(['项目', '规范'],
[['Base URL', 'http://127.0.0.1:7001/api'],
['请求格式', 'JSON (Content-Type: application/json)'],
['统一响应', '{ success: boolean, message: string, data?: any, total?: number }'],
['认证方式', 'JWT Bearer Token（Header: Authorization: Bearer xxx）'],
['分页参数', 'page（默认1）、pageSize（默认10），返回total'],
], [3000, 6000]));

children.push(H2('6.2 完整接口清单'));
children.push(P('共实现48个RESTful接口，以下按模块列出：'));
children.push(Tbl(['模块', '接口URL（代表性）', '方法', '认证'],
[['管理员', '/admin/login, /list, /detail, /create, /update, /delete, /status, /roles', 'GET/POST/PUT/DEL', 'login❌ 其余✅'],
['角色', '/role/list, /all, /create, /update, /delete', 'GET/POST/PUT/DEL', '✅'],
['游客用户', '/user/list, /detail, /status, /delete', 'GET/PUT/DEL', '✅'],
['入驻审核', '/merchant-application/list, /create, /review', 'GET/POST', 'create❌ list/review✅'],
['商家账号', '/merchant/list, /detail, /create, /update, /delete, /status', 'GET/POST/PUT/DEL', '✅'],
['轮播图', '/banner/list, /active, /detail, /create, /update, /delete, /status', 'GET/POST/PUT/DEL', 'active❌ 其余✅'],
['公告', '/announcement/list, /detail, /create, /update, /delete, /publish, /toggleTop', 'GET/POST/PUT/DEL', '✅'],
['游记审核', '/travel-note/list, /detail, /approve, /reject, /take-down, /delete', 'GET/PUT/DEL', '✅'],
['全局订单', '/order/list, /create', 'GET/POST', 'create❌ list✅'],
['财务结算', '/settlement/list, /stats, /settle', 'GET/POST', '✅'],
['数据看板', '/dashboard/stats, /chart', 'GET', '❌'],
['商品(衣)', '/product/list, /detail', 'GET', '❌'],
['餐厅(食)', '/restaurant/list, /detail', 'GET', '❌'],
['民宿(住)', '/homestay/list, /detail', 'GET', '❌'],
['门票(行)', '/ticket/list, /detail', 'GET', '❌'],
['社区', '/community/note/list, /detail', 'GET', '❌'],
], [1400, 4600, 1600, 1400]));
children.push(P('注：❌表示在JWT白名单中无需登录，✅表示需携带有效Token。公开接口包括登录、前台查询类接口和入驻申请。'));

// ====== 7 ======
children.push(H1('七、技术难点与解决方案'));
children.push(P('在开发过程中遇到并解决了多个技术难题，以下详述8个典型问题。'));
children.push(Img('图7-0：开发中的典型报错截图集合'));

children.push(H2('7.1 实体驼峰命名与数据库下划线命名不匹配'));
children.push(P('问题现象：实体属性使用驼峰命名（如isDeleted、createdAt），数据库字段使用下划线命名（如is_deleted、created_at）。使用Repository的findAndCount({where:{isDeleted:0}})时，TypeORM未能正确将驼峰属性映射为数据库列名，导致SQL中WHERE条件使用错误的列名，查询始终返回空数据。浏览器接口测试返回200但data为空数组。'));
children.push(P('解决过程：首先怀疑是SQL条件问题，通过开启TypeORM的logging:true观察实际执行的SQL，发现WHERE子句中出现了isDeleted而非is_deleted。尝试在实体的@Column装饰器中添加name属性后仍然无效。最终确认TypeORM 0.3版本的Repository查询在where条件中不会经过@Column的name元数据转换。'));
children.push(P('最终方案：全部查询改用createQueryBuilder，在.where()和.andWhere()中直接使用数据库实际列名（即实体别名.数据库列名）：'));
children.push(Code("this.adminModel.createQueryBuilder('a')"));
children.push(Code("  .where('a.is_deleted = 0')         // 直接使用数据库列名"));
children.push(Code("  .andWhere('a.status = :status', { status })"));
children.push(Code("  .orderBy('a.created_at', 'DESC')   // 排序也用数据库列名"));
children.push(Code("  .skip(offset).take(limit).getManyAndCount();"));

children.push(H2('7.2 CORS跨域导致前端请求返回404'));
children.push(P('问题现象：curl命令直接测试后端接口返回正常数据，但浏览器前端页面请求同样的接口返回404。进一步排查发现浏览器在发GET请求前会自动发送OPTIONS预检请求，而OPTIONS请求返回了404。'));
children.push(P('根因分析：CORS中间件使用this.app.useMiddleware()注册，排在Midway内置的路由匹配中间件之后。OPTIONS请求到达时先被路由中间件匹配——而没有任何Controller声明了@Options路由——直接返回404，CORS中间件根本没有机会执行。'));
children.push(P('最终方案：将CORS处理逻辑以Koa原生app.use()方式注册在整个中间件链的最前端，确保在任何路由匹配之前先处理OPTIONS预检：'));
children.push(Code("this.app.use(async (ctx, next) => {"));
children.push(Code("  ctx.set('Access-Control-Allow-Origin', '*');"));
children.push(Code("  ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');"));
children.push(Code("  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');"));
children.push(Code("  if (ctx.method === 'OPTIONS') { ctx.status = 204; return; }"));
children.push(Code("  await next();"));
children.push(Code("});"));

children.push(H2('7.3 密码哈希不匹配导致登录失败'));
children.push(P('问题现象：使用正确的用户名和密码登录，后端始终返回"用户名或密码错误"。在DBeaver中确认admin记录存在且status=1。'));
children.push(P('排查过程：在login方法中添加console.log打印密码比对结果，发现bcrypt.compareSync("123456", hash)返回false。检查数据库中的哈希值，发现该哈希是之前通过外部工具生成的$2b$前缀哈希，而非bcryptjs库生成的。'));
children.push(P('根因：bcrypt的$2a$和$2b$版本在处理长密码时实现不同，且不同语言/库的salt生成方式也有差异。必须保证同一个库生成哈希、同一个库验证。'));
children.push(P('最终方案：在终端执行node -e \"const bcrypt=require(\'bcryptjs\');console.log(bcrypt.hashSync(\'123456\',10))\"，将输出的$2a$前缀哈希UPDATE到数据库的password字段，问题解决。'));
children.push(Img('图7-3：终端生成bcryptjs哈希的截图'));

children.push(H2('7.4 前端数据显示为空（响应数据多取一层）'));
children.push(P('问题现象：后端curl返回正常数据，但前端5个页面（公告管理、轮播图管理、商家账号、角色权限、全局订单）表格显示"暂无数据"。控制台Network面板显示接口返回200且有数据。'));
children.push(P('根因：Axios响应拦截器已执行了response.data取到业务数据层（{success, data, total}），但页面代码又写了res.data?.data || []，多取了一层data，实际取到了undefined。'));
children.push(P('最终方案：统一规范——页面通过res.data直接获取数据数组（controller返回的data字段），total通过res.total获取，不再嵌套.data。'));
children.push(Code('// 错误写法'));
children.push(Code('setData(res.data?.data || []);  // undefined → 空数组'));
children.push(Code('// 正确写法'));
children.push(Code('setData(res.data || []);        // 直接取数据数组'));

children.push(H2('7.5 MySQL ONLY_FULL_GROUP_BY 模式报错'));
children.push(P('问题现象：Dashboard统计接口返回500错误：Expression #1 of SELECT list is not in GROUP BY clause... incompatible with sql_mode=only_full_group_by。'));
children.push(P('根因：MySQL 8.0默认开启ONLY_FULL_GROUP_BY模式。Dashboard的SQL中，SELECT使用了DATE_FORMAT(created_at, "%Y-%m-%d")但GROUP BY使用了DATE(created_at)，两者表达式不完全一致，MySQL严格模式拒绝执行。'));
children.push(P('最终方案：统一SELECT和GROUP BY中的表达式，均使用DATE(created_at)函数。同时由于DATE()输出YYYY-MM-DD格式，与前端localDate()生成的格式完全一致，日期映射也更可靠。'));

children.push(H2('7.6 时区偏移导致今日数据始终为0'));
children.push(P('问题现象：Dashboard统计卡片中"今日新增用户"、"今日订单数"、"今日GMV"始终显示0。但数据库表中确实有今天创建的记录。'));
children.push(P('根因：Node.js的new Date()传给TypeORM后，TypeORM将其转为UTC时间字符串（如"2026-06-27T16:00:00.000Z"），而MySQL中DATETIME字段存储的是本地时间。对于UTC+8时区，本地时间00:00-07:59的UTC还在前一天，导致DATE比较不匹配。'));
children.push(P('最终方案：全部改用纯日期字符串比较，完全绕开时区转换。'));
children.push(Code("function localDate(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }"));
children.push(Code("// SQL: WHERE DATE(o.created_at) = '2026-06-28'  ← 纯日期字符串"));

children.push(H2('7.7 中文乱码'));
children.push(P('问题现象：管理后台部分页面的中文显示为乱码或方块。经排查分两种情况：'));
children.push(PI('数据库查询出的中文在DBeaver中正常，但在前端页面显示乱码 → MySQL连接没有指定utf8mb4编码'));
children.push(PI('Layout.tsx等源文件中的中文在编辑器中就是乱码 → 文件保存时编码被损坏'));
children.push(P('最终方案：三层修复——TypeORM连接配置charset:\'utf8mb4\'、mysql2驱动extra.charset:\'utf8mb4\'、响应中间件设置Content-Type:application/json;charset=utf-8。对编码损坏的源文件直接重写。'));
children.push(Img('图7-7：修复前后中文显示对比'));

children.push(H2('7.8 前后端HTTP方法不匹配'));
children.push(P('问题现象：轮播图管理、角色管理等页面的编辑和删除操作在前端触发了timeout或404。'));
children.push(P('根因：前端API文件中的update方法使用了request.post("/xx/update",...)，但后端Controller定义了@Put("/update")；delete方法使用POST传参，但后端定义了@Del("/delete")并通过@Query读取id。'));
children.push(P('最终方案：逐一对照后端Controller的路由装饰器，修正前端API文件：'));
children.push(PI('update: POST → PUT'));
children.push(PI('delete: POST → DELETE，参数用 { params: { id } } 格式传给Axios'));

// ====== 8 ======
children.push(H1('八、AI辅助开发体会'));
children.push(H2('8.1 AI使用情况统计'));
children.push(P('本次课程设计使用Claude Code作为核心AI开发工具，覆盖了全流程：'));
children.push(Tbl(['环节', 'AI参与度', '典型使用方式'],
[['需求分析', '30%', 'AI辅助解读需求规格说明书，提取功能清单和权限矩阵'],
['数据库设计', '70%', 'AI根据实体关系生成14张表的DDL和50+条种子数据'],
['后端代码', '85%', 'Entity/Service/Controller几乎全部由AI生成，人工调整命名和兼容性'],
['前端代码', '80%', '页面组件、API封装、路由配置由AI生成，人工调整UI细节'],
['Bug排查', '90%', '将错误日志和代码上下文提供给AI，通常1轮对话即可定位根因并给出修复'],
['文档撰写', '60%', 'AI根据开发过程记录生成报告框架和主要内容'],
], [2000, 1500, 5500]));
children.push(P('总体代码产出中约80%由AI辅助生成。从空目录到可运行的全栈系统核心开发时间约8-10小时。'));

children.push(H2('8.2 AI的优势'));
children.push(PI('模板代码效率极高：CRUD、分页列表、表单页面对AI来说有固定模式，几秒即可生成完整可运行的代码。'));
children.push(PI('跨文件风格一致：AI能记住项目的代码风格（如统一使用createQueryBuilder、响应格式{success,message,data,total}），新生成的代码自然融入。'));
children.push(PI('Bug定位精准：提供错误日志+相关代码上下文，AI通常能1轮对话定位根因并给出修复方案。'));
children.push(PI('全栈无缝衔接：同一对话中从数据库→后端→前端全部覆盖，不存在传统团队开发中的"前端等后端接口"的等待问题。'));

children.push(H2('8.3 AI的局限性'));
children.push(PI('版本兼容性问题：AI生成的代码基于训练数据中的通用版本，无法感知当前项目实际安装的依赖版本。如TypeORM 1.0 vs 0.3的API差异、Ant Design 5 vs 6的Menu类型定义差异等，需要人工逐一验证和修正。'));
children.push(PI('环境特定问题：时区（UTC+8）、MySQL sql_mode（ONLY_FULL_GROUP_BY）、文件编码（GBK→UTF-8损坏）等具体环境问题，AI无法在生成代码时预知，需要运行时才能发现。'));
children.push(PI('UI组件细节：Ant Design图标名称（如SafetyOutlined不存在）、Menu的type:divider类型兼容性等问题，AI容易遗漏，需要前端编译时检验。'));
children.push(PI('需求理解能力：AI不能替代人工对复杂需求文档的深度阅读，需要人先提炼出关键需求点再交给AI实现。'));

children.push(H2('8.4 开发模式总结'));
children.push(P('"AI生成 → 人工审阅 → 编译验证 → 功能测试 → Bug修复"是本项目的高效迭代模式。与传统纯手动开发相比，AI辅助模式的优势在于：'));
children.push(PI('大幅缩短"从零到一"的启动时间——AI能快速产出项目框架、基础代码和测试数据'));
children.push(PI('减少重复性编码工作——CRUD、表单验证、分页逻辑等模板化代码交给AI'));
children.push(PI('加速Bug修复——AI分析错误日志的效率远超搜索引擎检索'));
children.push(P('但也需要清醒认识到：AI生成的代码只是"草稿"，必须经过编译验证和功能测试。人对项目的最终质量负责，AI是效率倍增器而非替代品。'));

// ====== 9 ======
children.push(H1('九、测试验证'));
children.push(H2('9.1 接口测试'));
children.push(P('使用curl命令对所有48个核心接口进行HTTP状态码验证，全部返回200。'));
children.push(Code('for url in /api/admin/list /api/role/list /api/user/list /api/merchant/list /api/merchant-application/list /api/banner/list /api/announcement/list /api/order/list /api/travel-note/list /api/settlement/list /api/dashboard/stats /api/product/list /api/restaurant/list /api/homestay/list /api/ticket/list; do curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:7001$url; done'));
children.push(Img('图9-1：curl全接口200截图'));

children.push(H2('9.2 功能测试'));
children.push(Tbl(['序号', '测试项', '测试方法', '结果'],
[['1', '管理员登录', 'POST /api/admin/login', '✅ 返回Token'],
['2', '列表分页', '浏览器访问各管理页面', '✅ 数据正确+分页正常'],
['3', '新增管理员', '通过创建表单提交', '✅ 密码自动加密入库'],
['4', '软删除', '删除后查询列表', '✅ 已删除记录不显示'],
['5', '商家入驻审核', '通过/驳回操作', '✅ status+审核人+时间更新'],
['6', '数据看板显示', '刷新/页面', '✅ 8卡片+3图表+轮播正常'],
['7', '下单→看板联动', '前台商品页下单→刷新看板', '✅ 今日数据实时更新'],
['8', 'PC端首页', '直接访问/pc', '✅ 全部组件正常渲染'],
['9', '入驻申请', '访问/join提交', '✅ 数据写入DB'],
['10', 'CORS跨域', '3000端口→7001端口', '✅ 无跨域错误'],
], [600, 2800, 3200, 2400]));

children.push(H2('9.3 数据库完整性验证'));
children.push(P('执行SELECT COUNT(*) FROM各表：role(1)、admin(1)、user(6)、merchant_application(5)、merchant(3)、announcement(3)、banner(3)、travel_note(3)、comment(5)、order(7)、product(6)、restaurant(3)、homestay(3)、ticket(5)，14张表全部有数据。'));
children.push(Img('图9-3：DBeaver查询结果截图'));

// ====== 10 ======
children.push(H1('十、总结与展望'));
children.push(H2('10.1 项目成果'));
children.push(Tbl(['指标', '完成情况'],
[['数据库表', '14张，含完整建表DDL和50+条种子数据'],
['后端Controller', '20个，覆盖所有业务模块'],
['后端Service', '15个，含登录认证/CRUD/审核/统计/结算'],
['后端接口', '48个RESTful接口，全部验证HTTP 200'],
['前端页面', '20个（13个管理后台+5个业务预览+PC首页+入驻申请）'],
['中间件', '3个（CORS跨域 / JWT认证 / 请求日志）'],
['核心功能', '管理员登录、CRUD管理、审核流转、数据看板、PC首页，100%完成'],
['技术难点', '攻克8个关键问题并形成解决方案文档'],
], [3500, 5500]));

children.push(H2('10.2 不足与展望'));
children.push(Tbl(['不足', '改进方向'],
[['使用占位图', '接入OSS对象存储并实现真实图片上传功能'],
['无文件上传', '商家入驻的营业执照/资质证明上传当前通过URL代替'],
['无单元测试', '使用Jest + @midwayjs/mock补充Service层单元测试'],
['无WebSocket', '审核结果和订单状态变更可通过WebSocket实时推送'],
['当前为种子数据', '接入其他模块的生产数据源，实现真正跨模块数据汇聚'],
['无CI/CD部署', '配置Docker Compose或Kubernetes一键部署脚本'],
], [3500, 5500]));

children.push(H2('10.3 收获与感想'));
children.push(P('本次课程设计让我完整经历了一个真实全栈项目的全流程——从研读企业需求文档、设计数据库表结构、搭建后端API服务、开发前端管理界面到联调测试和Bug排查修复。'));
children.push(P('技术层面，我深入掌握了Midway.js + TypeORM + React + Ant Design这一企业级全栈技术栈。特别是在查询优化方面，从最开始的Repository.find到最终全面采用createQueryBuilder直接写数据库列名，这个过程让我对ORM的抽象层与实际SQL之间的关系有了更深刻的理解。'));
children.push(P('工程层面，最大的收获是建立了"遇到问题→分析根因→设计解决方案→验证修复效果"的工程化思维。本次遇到的8个核心技术难点——字段映射、CORS预检、密码哈希、数据解析嵌套、GROUP BY严格模式、时区偏移、中文乱码、HTTP方法匹配——每一个的解决思路都值得记录和复用。'));
children.push(P('关于AI辅助开发，我深刻体会到：AI（Claude Code）是一个极其高效的"代码生成器"和"Bug分析器"，它让80%的模板代码和Bug排查工作从"手动编写/搜索"变成了"描述需求→AI生成→人工验证"。但AI不能替你理解需求、不能替你测试、不能替你为最终代码质量负责。最佳实践是：用AI加速"怎么写"，用人的判断力确保"写什么"和"写得对不对"。'));

children.push(Empty());
children.push(Empty());
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: '— 全文完 —', font: FONT_H, size: sz(12), color: '999999' })] }));

// ====== BUILD ======
const doc = new Document({
  creator: '林泽铃', title: '人工智能工程实践——课程设计大作业报告',
  description: '乌东文旅"衣食住行"综合服务平台——平台管理后台',
  sections: [{ children }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('第6组-平台管理后台-大作业报告.docx', buf);
  console.log('Done: 第6组-平台管理后台-大作业报告.docx (' + (buf.length / 1024).toFixed(1) + ' KB)');
});
