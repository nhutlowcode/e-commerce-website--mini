import { useState } from 'react' 
import { useSearchParams, useNavigate } from 'react-router-dom' 
import axiosInstance from '../utils/axiosConfig.js' 

const ResetPassword = () => {
    // Bản chất: useSearchParams giúp bóc tách các tham số trên URL (?token=abc)
    const [searchParams] = useSearchParams() 
    const token = searchParams.get('token')  // Lấy chính xác giá trị của tham số mang tên 'token'

    const [newPassword, setNewPassword] = useState('') 
    const [confirmPassword, setConfirmPassword] = useState('')  // Thêm ô nhập lại để tăng trải nghiệm người dùng
    const [errorMsg, setErrorMsg] = useState('') 
    const [successMsg, setSuccessMsg] = useState('') 
    const [isLoading, setIsLoading] = useState(false) 
    
    const navigate = useNavigate() 

    const handleSubmit = async (e) => {
        e.preventDefault() 
        setErrorMsg('') 
        setSuccessMsg('') 

        // [Chốt chặn Frontend]: Kiểm tra khớp mật khẩu để đỡ mất công gọi API vô ích
        if (newPassword !== confirmPassword) {
            return setErrorMsg('Mật khẩu nhập lại không trùng khớp!') 
        }

        // [Chốt chặn phòng thủ]: Nếu link thiếu token do user copy thiếu, chặn lại luôn
        if (!token) {
            return setErrorMsg('Mã xác thực không tồn tại trên đường dẫn URL!') 
        }

        setIsLoading(true) 

        try {
            // Bắn dữ liệu xuống API Backend chúng ta đã viết rất kỹ ở lượt trước
            const response = await axiosInstance.post('/api/auth/reset-password', {
                token, // Token lấy từ URL
                newPassword // Mật khẩu mới
            }) 

            setSuccessMsg(response.data.message) 
            
            // Đổi mật khẩu xong thì đá user về trang Login sau 2 giây để họ trải nghiệm
            setTimeout(() => {
                navigate('/login') 
            }, 1500) 

        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMsg(error.response.data.message) 
            } else {
                setErrorMsg('Không thể kết nối đến máy chủ!') 
            }
        } finally {
            setIsLoading(false) 
        }
    } 

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Đặt Lại Mật Khẩu</h2>
                    <p className="text-gray-500 text-sm">Vui lòng nhập mật khẩu mới cho tài khoản của bạn</p>
                </div>

                {errorMsg && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">{errorMsg}</div>}
                {successMsg && <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg}
                        className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-colors ${
                            isLoading || successMsg ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
                        }`}
                    >
                        {isLoading ? 'Đang xử lý...' : successMsg ? 'Đang chuyển hướng...' : 'Cập nhật mật khẩu'}
                    </button>
                </form>
            </div>
        </div>
    ) 
} 

export default ResetPassword 