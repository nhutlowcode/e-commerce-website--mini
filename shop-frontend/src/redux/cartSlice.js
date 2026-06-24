import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../utils/axiosConfig.js'

// Thunk 1: Lấy giỏ hàng từ Backend (Chỉ dùng khi đã đăng nhập)
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('/api/cart')
        return response.data.items.map(item => ({
            ...item.product,
            quantity: item.quantity 
        }))
    } catch (error) {
        console.log("Lỗi ở fetchCart: ", error)
        return rejectWithValue('Lỗi lấy giỏ hàng')
    }
})

// Thunk 2: Hàm Thêm vào giỏ đa năng (Tự nhận biết Khách / User)
export const addToCartAction = createAsyncThunk('cart/addToCartAction', async (product, { getState, rejectWithValue }) => {
    const state = getState()
    const isAuth = !!state.auth.user // Kiểm tra xem có token/user chưa

    if (isAuth) {
        //  CÓ TÀI KHOẢN: Cất vào Database qua API
        try {
            const response = await axiosInstance.post('/api/cart', {
                productId: product.id,
                quantity: 1 
            })
            return response.data.items.map(item => ({
                ...item.product,
                quantity: item.quantity
            }))
        } catch (error) {
            console.log("Lỗi ở addToCartAction: ", error)
            return rejectWithValue('Lỗi thêm vào giỏ hàng trên máy chủ')
        }
    } else {
        // KHÁCH VÃNG LAI: Chỉ cập nhật State nội bộ (Redux-persist sẽ tự lo việc lưu xuống ổ cứng)
        let currentCart = [...state.cart.cartItems]
        const existingItem = currentCart.find((item) => item.id === product.id)

        if (!existingItem) {
            currentCart.push({ ...product, quantity: 1 })
        } else {
            currentCart = currentCart.map(item => 
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
        }
        return currentCart
    }
})

export const removeFromCartAction = createAsyncThunk('cart/removeFromCartAction', async (productId, { getState, rejectWithValue }) => {
        const state = getState()
        const isAuth = !!state.auth.user

        if (isAuth) {
            try {
                const response = await axiosInstance.delete(`/api/cart/${productId}`)

                return response.data.items.map(item => ({
                    ...item.product,
                    quantity: parseInt(item.quantity)
                }))
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm", error)
                return rejectWithValue("Lỗi khi xóa sản phẩm")
            }
            
        } else {
            const currentCart = state.cart.cartItems.filter(item => item.id !== productId)
            return currentCart
        } 
    } 
)

export const updateQuantityAction = createAsyncThunk('cart/updateQuantityAction', async ({ id, quantity }, { getState, rejectWithValue }) => {
    const state = getState()
    const isAuth = !!state.auth.user

    if (quantity <= 0) {
        return rejectWithValue('Số lượng không hợp lệ')
    }

    if (isAuth) {
        try {
            const response = await axiosInstance.put(`/api/cart/${id}`, {
                quantity: parseInt(quantity)
            })

            return response.data.items.map(item => ({
                ...item.product,
                quantity: parseInt(item.quantity)
            }))
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng: ', error)
            return rejectWithValue('Lỗi khi cập nhật số lượng')
        }
    } 
    // với khách vãng lai sẽ update vào redux
    else {
        const currentCart = [...state.cart.cartItems]
        const itemIndex = currentCart.findIndex(item => item.id === id)
        if (itemIndex >= 0) {
            currentCart[itemIndex] = {...currentCart[itemIndex], quantity: parseInt(quantity)}
        }
        return currentCart
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        // Không cần JSON.parse mồi nữa, khởi tạo mảng rỗng, redux-persist sẽ tự nạp đồ vào đây khi F5
        cartItems: [], 
        isLoading: false
    },
    reducers: {
        clearCart: (state) => {
            state.cartItems = []
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.cartItems = action.payload
        })
        
        builder.addCase(addToCartAction.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(addToCartAction.fulfilled, (state, action) => {
            state.isLoading = false
            state.cartItems = action.payload // Gán mảng mới vào, Redux-persist sẽ tự chớp lấy và lưu offline
        })

        builder.addCase(addToCartAction.rejected, (state) => {
            state.isLoading = false
        })
        
        builder.addCase(removeFromCartAction.fulfilled, (state, action) => {
            state.cartItems = action.payload
        })

        builder.addCase(updateQuantityAction.fulfilled, (state, action) => {
            state.cartItems = action.payload
        })
    }
}) 

export const { clearCart } = cartSlice.actions
export default cartSlice.reducer