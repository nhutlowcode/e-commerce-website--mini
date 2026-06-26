import axios from 'axios'
import { loginSuccess, logout } from '../redux/authSlice.js'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
})

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isInterceptorSetup = false

export const setupAxiosInterceptors = (store) => {
    if (isInterceptorSetup) return
    isInterceptorSetup = true

    // response interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            return response
        },
        async (error) => {
            const originalRequest = error.config

            if (
                error.response &&
                error.response.status === 401 &&
                originalRequest &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true

                try {
                    const response = await axios.post(
                        'http://localhost:5000/api/auth/refresh-token',
                        {},
                        {
                            withCredentials: true
                        }
                    )

                    const { accessToken } = response.data

                    localStorage.setItem('accessToken', accessToken)

                    store.dispatch(loginSuccess({
                        user: store.getState().auth.user,
                        token: accessToken
                    }))

                    originalRequest.headers = originalRequest.headers || {}
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    store.dispatch(logout())
                    localStorage.removeItem('accessToken')
                    window.location.href = '/login'

                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error)
        }
    )
}

export default axiosInstance