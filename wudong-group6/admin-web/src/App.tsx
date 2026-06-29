import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { CartProvider } from './components/CartContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminList from './pages/AdminList';
import MerchantApplication from './pages/MerchantApplication';
import RoleList from './pages/RoleList';
import BannerList from './pages/BannerList';
import Settings from './pages/Settings';
import AnnouncementList from './pages/AnnouncementList';
import MerchantList from './pages/MerchantList';
import OrderList from './pages/OrderList';
import SettlementList from './pages/SettlementList';
import TravelNoteList from './pages/TravelNoteList';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import FoodList from './pages/FoodList';
import HomestayList from './pages/HomestayList';
import TravelTicketList from './pages/TravelTicketList';
import CommunityList from './pages/CommunityList';
import CategoryList from './pages/CategoryList';
import ReviewList from './pages/ReviewList';
import AgroProductList from './pages/AgroProductList';
import MealSlotList from './pages/MealSlotList';
import AgroCategoryList from './pages/AgroCategoryList';
import RestaurantReviewList from './pages/RestaurantReviewList';
import HomestayReviewList from './pages/HomestayReviewList';
import TrafficGuideList from './pages/TrafficGuideList';
import TicketReviewList from './pages/TicketReviewList';
import CommentAdminList from './pages/CommentAdminList';
import TopicList from './pages/TopicList';
import MyFavorites from './pages/MyFavorites';
import MyOrders from './pages/MyOrders';
import PublicHome from './pages/PublicHome';
import MerchantJoin from './pages/MerchantJoin';
import PublicProduct from './pages/PublicProduct';
import PublicFood from './pages/PublicFood';
import PublicHomestay from './pages/PublicHomestay';
import PublicTickets from './pages/PublicTickets';
import PublicCommunity from './pages/PublicCommunity';

// 路由守卫
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* PC端公开页面 */}
          <Route path="/pc" element={<PublicHome />} />
          <Route path="/pc/product" element={<PublicProduct />} />
          <Route path="/pc/food" element={<PublicFood />} />
          <Route path="/pc/homestay" element={<PublicHomestay />} />
          <Route path="/pc/tickets" element={<PublicTickets />} />
          <Route path="/pc/community" element={<PublicCommunity />} />
          <Route path="/pc/favorites" element={<MyFavorites />} />
          <Route path="/pc/orders" element={<MyOrders />} />
          <Route path="/join" element={<MerchantJoin />} />
          {/* 管理后台（需登录） */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<AdminList />} />
            <Route path="application" element={<MerchantApplication />} />
            <Route path="role" element={<RoleList />} />
            <Route path="banner" element={<BannerList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="announcement" element={<AnnouncementList />} />
            <Route path="merchant" element={<MerchantList />} />
            <Route path="order" element={<OrderList />} />
            <Route path="settlement" element={<SettlementList />} />
            <Route path="travel-note" element={<TravelNoteList />} />
            <Route path="user" element={<UserList />} />
            <Route path="product-category" element={<CategoryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product-reviews" element={<ReviewList />} />
            <Route path="agro-products" element={<AgroProductList />} />
            <Route path="meal-slots" element={<MealSlotList />} />
            <Route path="agro-category" element={<AgroCategoryList />} />
            <Route path="restaurant-reviews" element={<RestaurantReviewList />} />
            <Route path="homestay-reviews" element={<HomestayReviewList />} />
            <Route path="ticket-reviews" element={<TicketReviewList />} />
            <Route path="traffic-guides" element={<TrafficGuideList />} />
            <Route path="comment-admin" element={<CommentAdminList />} />
            <Route path="topics" element={<TopicList />} />
            <Route path="food" element={<FoodList />} />
            <Route path="homestay" element={<HomestayList />} />
            <Route path="tickets" element={<TravelTicketList />} />
            <Route path="community" element={<CommunityList />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;
