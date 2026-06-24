import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom' // 👉 Import thêm Link

const Register = () => {
    // Khởi tạo state cho 3 trường dữ liệu
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // State quản lý thông báo và trạng thái loading
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false) // 👉 Khóa nút bấm

    const navigate = useNavigate()

    const handleRegister = async (e) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')
        setIsLoading(true) // Bắt đầu load

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name: name,
                email: email,
                password: password
            }) 

            setSuccessMsg(response.data.message) 
            setName('') 
            setEmail('') 
            setPassword('')
            
            setTimeout(() => {
                navigate('/login')
            }, 1500)
            
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMsg(error.response.data.message) 
            } else {
                setErrorMsg('Không thể kết nối đến máy chủ!') 
            }
            setIsLoading(false) // Mở khóa nút nếu có lỗi
        }
    } 

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Tạo Tài Khoản</h2>
                    <p className="text-gray-500 text-sm">Đăng ký để trải nghiệm mua sắm tuyệt vời</p>
                </div>

                {/* Khu vực thông báo */}
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">
                        {errorMsg}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">
                        {successMsg}
                    </div>
                )}
                
                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="VD: Nguyễn Văn A"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập địa chỉ email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg}
                        className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-colors mt-2 ${
                            isLoading || successMsg ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : successMsg ? 'Thành công!' : 'Đăng ký ngay'}
                    </button>
                </form>

                {/* Lối thoát về trang Đăng nhập */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                        Bạn đã có tài khoản?{' '}
                        <Link to="/login" className="font-bold text-green-600 hover:text-green-500 hover:underline transition-all">
                            Đăng nhập
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    ) 
} 

export default Register