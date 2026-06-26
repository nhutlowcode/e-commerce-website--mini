import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import Home from './pages/Home'
import Cart from './pages/Cart' 
import ProductDetail from './pages/ProductDetail' 
import AddProduct from './pages/AddProduct' 
import AdminProducts from './pages/AdminProducts' 
import EditProduct from './pages/EditProduct' 
import Login from './pages/Login' 
import Register from './pages/Register' 
import Products from './pages/Products'
import Checkout from './pages/Checkout'
import AdminOrders from './pages/AdminOrders'
import OrderHistory from './pages/OrderHistory'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ClientLayout from './components/ClientLayout' 
import AdminLayout from './components/AdminLayout'
import AdminCategories from './pages/AdminCategories'

function App() {
  return (
    <GoogleOAuthProvider clientId='1003415528694-iq40cee3dr6ke68c6p4almh096d18i3b.apps.googleusercontent.com'>
      <BrowserRouter>
        {/* Đã xóa <div className="...">, <Navbar /> và <Footer /> ở đây */}
          <Routes>
            
            {/* NHÓM 1: CÁC TRANG CỦA KHÁCH HÀNG (Sẽ có Navbar và Footer) */}
            <Route element={<ClientLayout />}>
                <Route path='/' element={<Home />}/>
                <Route path='/products' element={<Products />}/>
                <Route path='/product/:id' element={<ProductDetail />}/>
                <Route path='/cart' element={<Cart />}/>
                <Route path='/checkout' element={<Checkout />}/>
                <Route path='/order-history' element={<OrderHistory />}/>
            </Route>

            {/* NHÓM 2: CÁC TRANG AUTH (Không cần Navbar/Footer cũng được, tùy bạn cấu hình. Ở đây mình cho nó đứng độc lập) */}
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />

            {/* NHÓM 3: CÁC TRANG ADMIN (Sẽ có Sidebar màu đen chuyên nghiệp) */}
            {/* Lưu ý: Các path con bên trong không cần chữ /admin nữa vì đã được bọc ở thẻ cha */}
            <Route path='/admin' element={<AdminLayout />}>
                <Route path='dashboard' element={<AdminDashboard />} />
                <Route path='products' element={<AdminProducts />} />
                <Route path='orders' element={<AdminOrders />} />
                <Route path='categories' element={<AdminCategories />} />
                <Route path='products/new' element={<AddProduct />} />
                <Route path='products/edit/:id' element={<EditProduct />} />
            </Route>

          </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  ) 
}

export default App;