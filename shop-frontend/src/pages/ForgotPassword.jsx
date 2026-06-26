import { useState } from 'react';
import axiosInstance from '../utils/axiosConfig.js';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/api/auth/forgot-password', { email });
            setSuccessMsg(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg('Không thể kết nối đến máy chủ!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-150px)] bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quên Mật Khẩu</h2>
                    <p className="text-gray-500 text-sm">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
                </div>

                {errorMsg && <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center font-medium">{errorMsg}</div>}
                {successMsg && <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center font-medium">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email tài khoản</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
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
                        {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu khôi phục'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-all">
                        ← Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;