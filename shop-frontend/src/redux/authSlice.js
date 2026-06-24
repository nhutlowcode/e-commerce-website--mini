import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // hàm chạy khi đang nhập thành công
        loginSuccess: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.token
            state.isAuthenticated = true
            // lưu token vào ổ cứng trình duyệt
            localStorage.setItem('accessToken', action.payload.token)
        },

        // hàm chạy khi người dùng bấm đăng xuất
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isAuthenticated = false

            // xóa token khỏi localStorage
            localStorage.removeItem('accessToken')
        }
    }
})

export const { loginSuccess, logout } = authSlice.actions

export default authSlice.reducer