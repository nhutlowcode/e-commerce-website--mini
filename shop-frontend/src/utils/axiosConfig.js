import axios from 'axios'
import { store } from '../redux/store.js'
import { loginSuccess, logout } from '../redux/authSlice'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
})

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // lấy accesstoken từ localStorage
        const token = localStorage.getItem('accessToken')
        // nếu có thì đính kèm access token vào trong requesr header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config // cho phép request tiếp tục đi
        },
        (error) => {
            return Promise.reject(error)
        }
)

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        // 
        const originalRequest = error.config
        // Nếu BE trả về lỗi 401(vé hết hạn) và request này chưa từng được thử lại trước đó
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true // đánh dấu request này đã được thử lại
            try {
                // Gọi API gia hạn ngầm xuống Backend. 
                // Dùng axios gốc (bản thô) để tránh bị dính vào bộ đánh chặn này một lần nữa.
                // Backend sẽ tự đọc chuỗi Refresh Token nằm trong HttpOnly Cookie đã gửi kèm.
                const response = await axios.post('http://localhost:5000/api/auth/refresh-token', {}, {
                    withCredentials: true
                })

                // nhận accessToken mới từ BE trả về
                const { accessToken } = response.data
                // cập nhật lại accessToken vào localStorage 
                localStorage.setItem('accessToken', accessToken)

                // cập nhật lại vào store của redux
                store.dispatch(loginSuccess({
                    user: store.getState().auth.user,
                    token: accessToken
                }))

                // gắn accessToken mới này vào header của request
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

                // ép request cũ chạy lại 1 lần nữa
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                // Nếu đến cả API gia hạn cũng sập (Do Refresh Token hết hạn hoàn toàn hoặc bị xóa khỏi DB)
                // Thì ép buộc người dùng phải đăng xuất ngay lập tức
                store.dispatch(logout());
                localStorage.removeItem('accessToken');
                window.location.href = '/login'; // Đá người dùng về trang đăng nhập
                return Promise.reject(refreshError);
            }
        }
        // Nếu là các lỗi khác (400, 403, 500...), ném thẳng ra cho Component tự xử lý
        return Promise.reject(error);
    }
) 

export default axiosInstance