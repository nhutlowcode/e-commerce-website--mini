import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import Footer from './components/Footer'
import Navbar from './components/Navbar'
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        
        {/* Navbar giờ sẽ tự hút số lượng giỏ hàng từ Redux, không cần truyền props */}
        <Navbar />

        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>

          {/* Xóa toàn bộ prop handleAddtoCart lằng nhằng ở các Route */}
          <Route path='/' element={<Home />}/>
          <Route path='/products' element={<Products />}/>
          <Route path='/product/:id' element={<ProductDetail />}/>
          
          <Route path='/cart' element={<Cart />}/>
          <Route path='/checkout' element={<Checkout />}/>

          
          <Route path='/order-history' element={<OrderHistory />}/>
          
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/products' element={<AdminProducts />} />
          <Route path='/admin/orders' element={<AdminOrders />} />
          <Route path='/admin/products/new' element={<AddProduct />} />
          <Route path='/admin/products/edit/:id' element={<EditProduct />} />
        </Routes>
        
        <Footer/>
      </div>
    </BrowserRouter>
  ) 
}

export default App;