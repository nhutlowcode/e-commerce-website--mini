import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/authSlice'
import { clearCart } from '../redux/cartSlice'

const AdminLayout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    const handleLogOut = () => {
        dispatch(logout())
        dispatch(clearCart())
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Cột trái: Sidebar */}
            <aside className="w-64 bg-blue-500 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-blue-400">Admin<span className="text-white">Panel</span></h2>
                </div>
                
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link to="/admin/dashboard" className="px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        📊 Tổng quan (Dashboard)
                    </Link>
                    <Link to="/admin/products" className="px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        📦 Quản lý Sản phẩm
                    </Link>
                    <Link to="/admin/orders" className="px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        🛒 Quản lý Đơn hàng
                    </Link>
                    <Link to="/admin/categories" className="px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        📂 Quản lý Danh mục
                    </Link>
                </nav>

                {/* Khu vực thông tin Admin ở đáy Sidebar */}
                <div className="p-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mb-2">Xin chào, {user?.name || 'Admin'}</p>
                    <button 
                        onClick={handleLogOut}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Cột phải: Khu vực hiển thị nội dung trang (Outlet) */}
            <main className="flex-1 flex flex-col">
                {/* Header nhỏ cho Admin */}
                <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Hệ thống quản trị</h1>
                    <Link to="/" className="text-sm text-blue-600 font-medium hover:underline">
                        Ra trang khách hàng &rarr;
                    </Link>
                </header>
                
                {/* Nội dung thực tế của các trang Admin sẽ được đổ vào đây */}
                <div className="p-8 overflow-y-auto flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout