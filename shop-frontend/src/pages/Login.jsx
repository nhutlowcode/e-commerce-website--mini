import { GoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import axiosInstance from '../utils/axiosConfig.js'
import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess } from '../redux/authSlice.js'
import { useNavigate, Link } from 'react-router-dom'   // 👉 Thêm Link để chuyển hướng trang Đăng ký
import { clearCart } from '../redux/cartSlice.js'

const Login = () => {
    // Khởi tạo state lưu trữ dữ liệu người dùng nhập
    const [email, setEmail] = useState('')  
    const [password, setPassword] = useState('')  
    const [errorMsg, setErrorMsg] = useState('')  
    const [successMsg, setSuccessMsg] = useState('')  
    const [isLoading, setIsLoading] = useState(false)   // 👉 Thêm state khóa nút

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cartItems = useSelector(state => state.cart.cartItems)

    // Hàm xử lý khi người dùng bấm nút Đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault()   
        setErrorMsg('')   
        setSuccessMsg('')  
        setIsLoading(true)   // Khóa nút khi bắt đầu gọi API

         try {
            const response = await axiosInstance.post('/api/auth/login',
                {
                    email: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            )

            const { accessToken, user } = response.data

            dispatch(loginSuccess(
                {
                    user: user,
                    token: accessToken
                }
            ))
            setSuccessMsg(response.data.message)

            if (cartItems.length > 0) {
                try {
                    await axiosInstance.post('/api/cart/merge', {
                        localCart: cartItems
                    })
                    dispatch(clearCart())
                } catch (mergeError) {
                    console.error('Lỗi khi gộp giỏ hàng:', mergeError)  
                }
            }

            setTimeout(() => {
                if (user.role === 'ADMIN') {
                    navigate('/admin/products')
                } else {
                    navigate('/')
                }
            }, 1500)
         } catch (error) {
            if (error.response && error.response.data) {
                setErrorMsg(error.response.data.message)
            } else {
                setErrorMsg('Không thể kết nối đến máy chủ!')
            }
            setIsLoading(false)   // Mở khóa nút nếu có lỗi
         }
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true)
        setErrorMsg('')
        try {
            const response = await axiosInstance.post('/api/auth/google', 
                { credential: credentialResponse.credential },
                { withCredentials: true })
            
            const { accessToken, user } = response.data

            dispatch(loginSuccess({ user, token: accessToken })) // dispatch hàm login ở redux để lưu access token vào localStorage
            setSuccessMsg('Đăng nhập bằng Google thành công.')

            if (cartItems.length > 0) {
                try {
                    await axiosInstance.post('/api/cart/merge', { localCart: cartItems })
                    dispatch(clearCart())
                } catch (mergeError) {
                    console.error('Lỗi khi gộp giỏ hàng:', mergeError)  
                }
             }

            setTimeout(() => {
                if (user.role === 'ADMIN') {
                    navigate('/admin/dashboard')
                } else {
                    navigate('/')
                }
            }, 1500)
        } catch (error) {
                setErrorMsg('Lỗi xác thực Google với máy chủ!')  
                setIsLoading(false)
                console.error('Lỗi khi xác thực Google với mấy chủ', error)
        }
    }
  
    return (
        // Nền xám bao quanh toàn bộ form, căn giữa màn hình
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            
            {/* Thẻ Card trắng chứa form */}
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Đăng Nhập</h2>
                    <p className="text-gray-500 text-sm">Vui lòng đăng nhập để tiếp tục mua sắm</p>
                </div>
                
                {/* Khu vực hiển thị thông báo lỗi (Làm nền đỏ nhạt nổi bật) */}
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                        {errorMsg}
                    </div>
                )}

                {/* Khu vực hiển thị thông báo thành công (Làm nền xanh lá nhạt) */}
                {successMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">
                        {successMsg}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            tabIndex={1}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Mật khẩu
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500            transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            tabIndex={2}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg}
                        className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-colors ${
                            isLoading || successMsg ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? 'Đang xử lý...' : successMsg ? 'Thành công!' : 'Đăng nhập'}
                    </button>
                </form>

                {/* Dòng phân cách "Hoặc" */}
                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
                    <span className="text-xs text-center text-gray-500 uppercase font-semibold">Hoặc đăng nhập bằng</span>
                    <span className="border-b border-gray-200 w-1/5 lg:w-1/4"></span>
                </div>

                {/* Khối chứa nút Google */}
                <div className="mt-6 flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setErrorMsg('Cửa sổ Google bị đóng hoặc xảy ra lỗi!')}
                        useOneTap // Bật tính năng One Tap (tự động gợi ý đăng nhập ở góc màn hình) cực kỳ hiện đại
                    />
                </div>

                {/* Chuyển hướng sang trang đăng ký */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                        Bạn chưa có tài khoản?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )  
}  

export default Login  