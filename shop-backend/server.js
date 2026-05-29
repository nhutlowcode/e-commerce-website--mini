import 'dotenv/config'  
import express from 'express' 
import cors from 'cors'
import productRoutes from './src/routes/productRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import cookieParser from 'cookie-parser'

// Khởi tạo các công cụ
const app = express() 
const PORT = 5000 

// Cấp phép cho FE gọi API và đọc dữ liệu Json
app.use(cors({
    origin: 'http://localhost:5173', // Bắt buộc phải trỏ chính xác địa chỉ của React
    credentials: true                // Cho phép Backend nhận và gửi Cookie
}))
app.use(express.json()) 
app.use(cookieParser())

// đăng ký các route
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`) 
}) 