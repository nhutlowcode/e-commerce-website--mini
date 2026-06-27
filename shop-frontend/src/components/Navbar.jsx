import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/authSlice.js'
import { clearCart } from '../redux/cartSlice.js'

function Navbar() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isAuthenticated } = useSelector((state) => state.auth)
    const cartItems = useSelector((state) => state.cart.cartItems || [])

    const handleLogOut = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/')
    }

  return (
    
    <nav className='bg-white shadow-md p-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
            {/* Phần Logo */}
            <Link 
                className='text-2xl font-bold text-blue-600 cursor-pointer'
                to='/'
                >
                MinhNhut <span className='text-gray-800'>Shop</span>
            </Link>
            {/* Phần menu ở giữa (ẩn trên điện thoại hiện trên màn hình lớn)*/}
            <div className='hidden md:flex space-x-8'>
                <Link to='/' className='text-gray-600 hover:text-blue-600 font-medium transition'>
                    Trang chủ
                </Link>
                <Link to='/products' className='text-gray-600 hover:text-blue-600 font-medium transition'>
                    Sản phẩm
                </Link>
                <Link to='/order-history' className='text-gray-600 hover:text-blue-600 font-medium transition'>
                    Đơn hàng
                </Link>
                {user?.role === 'ADMIN' && (
                    <Link to='/admin/dashboard' className='text-gray-600 hover:text-blue-600 font-medium transition'>
                    Vào trang quản trị
                </Link>
                )}
            </div>

            <div className='flex items-center gap-4'>
                { isAuthenticated ? (
                    <div className='flex items-center gap-4 mr-2'>
                        <span className='text-gray-700 font-medium'>
                           Chào bạn, {user?.name || user?.email}
                        </span>
                        <button
                            onClick={handleLogOut}
                            className='text-sm font-medium text-red-500 hover:text-red-700 transition'
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 mr-2">
                        <Link to='/login' className='text-gray-600 hover:text-blue-600 font-medium transition'>
                            Đăng nhập
                        </Link>
                        <Link to='/register' className='text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 font-medium transition'>
                            Đăng ký
                        </Link>
                    </div>
                )}
                {/* Nút giỏ hàng */}
                <div>
                    <Link
                        to='/cart'
                        className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transtion font-medium flex items-center gap-2'
                        >
                        Giỏ hàng
                        <span className='bg-white text-blue-600 rounded-full px-2 py-0.5 text-sm font-bold'>
                            {cartItems.length}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar