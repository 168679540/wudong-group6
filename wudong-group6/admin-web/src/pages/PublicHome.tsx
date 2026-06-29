import React, { useEffect, useState } from 'react';
import { Layout, Menu, Carousel, Card, Row, Col, Button, Tag, Steps, Spin, Rate, Image } from 'antd';
import { SkinOutlined, CoffeeOutlined, HomeOutlined, CompassOutlined, CameraOutlined, ShopOutlined, EnvironmentOutlined, PhoneOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../api/request';

const { Header, Content, Footer } = Layout;

const moduleList = [
  { key: 'product', title: '衣·非遗商品', desc: '苗族银饰、蜡染、刺绣、服饰等非遗手工艺品在线展示与购买', icon: <SkinOutlined style={{ fontSize: 48, color: '#1890ff' }} />, bg: '#e6f7ff', route: '/pc/product' },
  { key: 'restaurant', title: '食·餐饮美食', desc: '苗家酸汤鱼、长桌宴、农家菜等特色餐饮预订', icon: <CoffeeOutlined style={{ fontSize: 48, color: '#52c41a' }} />, bg: '#f6ffed', route: '/pc/food' },
  { key: 'homestay', title: '住·民宿住宿', desc: '苗寨观景民宿、梯田木屋、精品客栈在线预订', icon: <HomeOutlined style={{ fontSize: 48, color: '#faad14' }} />, bg: '#fffbe6', route: '/pc/homestay' },
  { key: 'ticket', title: '行·线路门票', desc: '景区门票、一日游路线、非遗体验两日游套餐', icon: <CompassOutlined style={{ fontSize: 48, color: '#f5222d' }} />, bg: '#fff2f0', route: '/pc/tickets' },
  { key: 'community', title: '社区·游记分享', desc: '游客实拍照片、旅行攻略、美食探店分享', icon: <CameraOutlined style={{ fontSize: 48, color: '#722ed1' }} />, bg: '#f9f0ff', route: '/pc/community' },
];

const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      request.get('/banner/active'),
      request.get('/community/note/list', { params: { pageSize: 6 } }),
      request.get('/dashboard/stats'),
    ]).then(([b, n, s]: any[]) => {
      if (b.success) setBanners(b.data || []);
      if (n.success) setNotes(n.data || []);
      if (s.success) setStats(s.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 200 }} />;

  return (
    <Layout>
      <Header style={{ background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 22, fontWeight: 'bold', color: '#1890ff', cursor: 'pointer' }} onClick={() => navigate('/pc')}>🏯 乌东文旅</div>
        <Menu mode="horizontal" defaultSelectedKeys={['home']} style={{ border: 'none' }}
          items={[
            { key: 'home', label: '首页' },
            { key: 'modules', label: '业务模块' },
            { key: 'join', label: '商家入驻' },
            { key: 'community', label: '游记社区' },
            { key: 'favorites', label: '我的收藏' },
          ]}
          onClick={({ key }) => {
            if (key === 'favorites') { navigate('/pc/favorites'); return; }
            document.getElementById(key)?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </Header>
      <Content>

        {/* ====== 轮播图 ====== */}
        <section id="home">
          {banners.length > 0 && (
            <Carousel autoplay>
              {banners.map((b: any) => (
                <div key={b.id}>
                  <img src={b.imageUrl} alt={b.title} style={{ width: '100%', height: 420, objectFit: 'cover' }} />
                </div>
              ))}
            </Carousel>
          )}
        </section>

        {/* ====== 平台介绍 ====== */}
        <section style={{ padding: '60px 80px', textAlign: 'center', background: '#fafafa' }}>
          <h1 style={{ fontSize: 36, marginBottom: 16 }}>乌东文旅 · 衣食住行综合服务平台</h1>
          <p style={{ fontSize: 18, color: '#666', maxWidth: 800, margin: '0 auto 40px', lineHeight: 1.8 }}>
            一站式探索贵州乌东苗族特色村寨——从非遗手工艺品、苗家美食、特色民宿到景区门票，
            覆盖您旅行的全链路需求。我们欢迎本地手工艺人、餐饮店主、民宿经营者入驻平台，
            共同打造乌东村数字化文旅新体验。
          </p>
          <Row gutter={24}>
            {[
              { icon: <ShopOutlined />, num: stats.totalMerchants || 3, label: '入驻商家' },
              { icon: <StarOutlined />, num: stats.totalUsers || 6, label: '注册用户' },
              { icon: <SkinOutlined />, num: 20, label: '非遗商品' },
              { icon: <CameraOutlined />, num: notes.length, label: '游记分享' },
            ].map((s, i) => (
              <Col key={i} span={6}>
                <div style={{ background: '#fff', borderRadius: 8, padding: '24px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 'bold' }}>{s.num}</div>
                  <div style={{ color: '#999' }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* ====== 业务模块 ====== */}
        <section id="modules" style={{ padding: '60px 80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, marginBottom: 40 }}>业务模块</h2>
          <Row gutter={[24, 24]}>
            {moduleList.map(m => (
              <Col key={m.key} xs={24} sm={12} md={8} lg={8}>
                <Card hoverable style={{ background: m.bg, borderRadius: 12, height: '100%' }} onClick={() => navigate(m.route)}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>{m.icon}</div>
                  <h3 style={{ textAlign: 'center', fontSize: 20 }}>{m.title}</h3>
                  <p style={{ color: '#666', lineHeight: 1.8, textAlign: 'center' }}>{m.desc}</p>
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Button type="primary" ghost>点击进入 →</Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* ====== 商家入驻 ====== */}
        <section id="join" style={{ padding: '60px 80px', background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, marginBottom: 16 }}>商家入驻指南</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 40, fontSize: 16 }}>以下四类商家可申请入驻乌东文旅平台</p>

          <Row gutter={24} style={{ marginBottom: 40 }}>
            {[
              { title: '衣·手工艺人', desc: '苗族银饰锻造、蜡染制作、刺绣工艺、民族服饰制作等非遗手工艺人及作坊', tag: '需提供作品照片及技艺说明', color: '#1890ff' },
              { title: '食·餐饮商家', desc: '苗家特色餐厅、农家菜馆、长桌宴经营者、农产品特产商户', tag: '需提供营业执照及卫生许可', color: '#52c41a' },
              { title: '住·民宿客栈', desc: '苗寨民宿、梯田客栈、精品酒店等住宿经营者', tag: '需提供经营资质及房间实拍', color: '#faad14' },
              { title: '行·旅行社/景区', desc: '景区运营方、旅行社、导游服务商、非遗体验工作室', tag: '需提供经营许可及线路说明', color: '#f5222d' },
            ].map((item, i) => (
              <Col key={i} xs={24} sm={12} md={6}>
                <Card style={{ borderRadius: 12, height: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: item.color, color: '#fff', textAlign: 'center', lineHeight: '40px', fontSize: 18, marginBottom: 12 }}>{i + 1}</div>
                  <h4 style={{ fontSize: 18 }}>{item.title}</h4>
                  <p style={{ color: '#666', lineHeight: 1.8, fontSize: 14 }}>{item.desc}</p>
                  <Tag color={item.color}>{item.tag}</Tag>
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32 }}>
            <h3 style={{ textAlign: 'center', marginBottom: 24 }}>入驻流程</h3>
            <Steps current={-1} direction="vertical" items={[
              { title: '提交申请', description: '选择入驻类型（衣/食/住/行），填写店铺名称、联系人、联系电话，上传营业执照及资质证明', status: 'process' },
              { title: '平台审核', description: '平台管理员将在1-3个工作日内完成资质审核，审核结果将通过短信通知', status: 'process' },
              { title: '开通账号', description: '审核通过后，为您开通商家管理账号，可在后台管理商品/餐位/房源/票务', status: 'process' },
              { title: '正式运营', description: '上架商品或服务，开始接单运营，按约定周期（T+3/T+7）进行财务结算', status: 'process' },
            ]} />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="primary" size="large" onClick={() => navigate('/join')}>
                立即申请入驻
              </Button>
            </div>
          </div>
        </section>

        {/* ====== 游记社区 ====== */}
        <section id="community" style={{ padding: '60px 80px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, marginBottom: 40 }}>游记社区</h2>
          <Row gutter={[24, 24]}>
            {notes.map(n => (
              <Col key={n.id} xs={24} sm={12} md={8}>
                <Card hoverable onClick={() => navigate('/pc/community')}
                  cover={n.coverImage ? <img alt={n.title} src={n.coverImage} style={{ height: 220, objectFit: 'cover' }} /> : null}>
                  <Card.Meta
                    title={<span style={{ fontSize: 16 }}>{n.title}</span>}
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <EnvironmentOutlined /> {n.location} · <CameraOutlined /> {n.authorName}
                        </div>
                        <div style={{ color: '#666', lineHeight: 1.6, marginBottom: 8 }}>{n.content?.slice(0, 100)}...</div>
                        <div>
                          <Tag>👁 {n.viewCount}</Tag>
                          <Tag>❤ {n.likeCount}</Tag>
                          <Rate disabled value={n.likeCount > 50 ? 5 : 4} style={{ fontSize: 14 }} />
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button type="primary" size="large" ghost onClick={() => navigate('/pc/community')}>
              查看更多游记 →
            </Button>
          </div>
        </section>

      </Content>

      <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '30px 50px' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>🏯 乌东文旅 · 衣食住行综合服务平台</div>
        <div>贵州乌东苗族特色村寨 | 数字化文旅一站式服务</div>
        <div style={{ marginTop: 8, color: '#999' }}>© 2026 第6组 平台管理后台 | Midway.js + React + Ant Design + MySQL</div>
        <div style={{ marginTop: 16 }}>
          <PhoneOutlined /> 咨询热线：400-XXX-XXXX | 地址：贵州省黔东南苗族侗族自治州乌东村
        </div>
      </Footer>
    </Layout>
  );
};

export default PublicHome;
