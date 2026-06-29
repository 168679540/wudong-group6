import { Layout as AntLayout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined, TeamOutlined, SettingOutlined, LogoutOutlined,
  AuditOutlined, SafetyCertificateOutlined, PictureOutlined, SoundOutlined,
  ShopOutlined, OrderedListOutlined, DollarCircleOutlined, FileTextOutlined, UserOutlined,
  SkinOutlined, AppstoreOutlined, EyeOutlined, CoffeeOutlined, HomeOutlined, CompassOutlined, ClockCircleOutlined, ShoppingCartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    { key: '/', icon: <DashboardOutlined />, label: '数据概览' },
    { type: 'divider' },
    {
      key: 'sys', icon: <SettingOutlined />, label: '系统管理',
      children: [
        { key: '/admin', icon: <TeamOutlined />, label: '管理员管理' },
        { key: '/user', icon: <UserOutlined />, label: '游客用户' },
        { key: '/role', icon: <SafetyCertificateOutlined />, label: '角色权限' },
        { key: '/settings', icon: <SettingOutlined />, label: '系统设置' },
      ],
    },
    { type: 'divider' },
    {
      key: 'yi', icon: <SkinOutlined />, label: '衣·非遗商品',
      children: [
        { key: '/product-category', icon: <AppstoreOutlined />, label: '分类管理' },
        { key: '/products', icon: <SkinOutlined />, label: '商品管理' },
        { key: '/product-reviews', icon: <EyeOutlined />, label: '评价管理' },
      ],
    },
    {
      key: 'shi', icon: <CoffeeOutlined />, label: '食·餐饮美食',
      children: [
        { key: '/food', icon: <CoffeeOutlined />, label: '餐厅管理' },
        { key: '/agro-products', icon: <ShoppingCartOutlined />, label: '农产品特产' },
        { key: '/meal-slots', icon: <ClockCircleOutlined />, label: '餐位时段' },
      ],
    },
    {
      key: 'zhu', icon: <HomeOutlined />, label: '住·民宿住宿',
      children: [
        { key: '/homestay', icon: <HomeOutlined />, label: '民宿管理' },
      ],
    },
    {
      key: 'xing', icon: <CompassOutlined />, label: '行·线路门票',
      children: [
        { key: '/tickets', icon: <CompassOutlined />, label: '票务管理' },
      ],
    },
    {
      key: 'she', icon: <FileTextOutlined />, label: '社区·游记',
      children: [
        { key: '/travel-note', icon: <FileTextOutlined />, label: '游记审核' },
      ],
    },
    { type: 'divider' },
    {
      key: 'ops', icon: <ShopOutlined />, label: '运营管理',
      children: [
        { key: '/application', icon: <AuditOutlined />, label: '商家入驻审核' },
        { key: '/merchant', icon: <ShopOutlined />, label: '商家账号' },
        { key: '/banner', icon: <PictureOutlined />, label: '轮播图管理' },
        { key: '/announcement', icon: <SoundOutlined />, label: '公告管理' },
        { key: '/order', icon: <OrderedListOutlined />, label: '全局订单' },
        { key: '/settlement', icon: <DollarCircleOutlined />, label: '财务结算' },
      ],
    },
  ];

  // 根据当前路径自动展开父菜单
  const getOpenKeys = () => {
    const path = location.pathname;
    const parentMap: Record<string, string> = {
      '/admin': 'sys', '/user': 'sys', '/role': 'sys', '/settings': 'sys',
      '/product-category': 'yi', '/products': 'yi', '/product-reviews': 'yi',
      '/food': 'shi', '/agro-products': 'shi', '/meal-slots': 'shi',
      '/homestay': 'zhu',
      '/tickets': 'xing',
      '/travel-note': 'she',
      '/application': 'ops', '/merchant': 'ops', '/banner': 'ops', '/announcement': 'ops', '/order': 'ops', '/settlement': 'ops',
    };
    return parentMap[path] ? [parentMap[path]] : [];
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider theme="light">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 'bold' }}>
          乌东文旅后台
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16 }}>平台管理后台</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
