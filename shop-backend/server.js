import 'dotenv/config' 
import express from 'express' 
import cors from 'cors'
import http from 'http'
import productRoutes from './src/routes/productRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import cartRoutes from './src/routes/cartRoutes.js'
import categoryRoutes from './src/routes/categoryRoutes.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'

const app = express() 
const PORT = process.env.PORT || 5000 

app.use(cors({
    origin: [process.env.CLIENT_URL_DEV, process.env.CLIENT_URL_PROD], 
    credentials: true                
}))

// CHỈ CẦN ĐÚNG 1 LỆNH NÀY LÀ ĐỦ ĐỂ XỬ LÝ TOÀN BỘ JSON (Bao gồm cả Webhook)
app.use(express.json()) 
app.use(cookieParser())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL_DEV, process.env.CLIENT_URL_PROD],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

app.use((req, res, next) => {
    req.io = io
    next()
})

io.on("connection", (socket) => {
    console.log(`Trình duyệt vừa kết nối: ${socket.id}`)
    socket.on('join_admin_room', () => {
        socket.join('admin_room')
        console.log(`Admin [${socket.id}] đã vào phòng điều hành`)
    })
    socket.on('disconnect', () => {
        console.log(`Trình duyệt ngắt kết nối: ${socket.id}`)
    })
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/category', categoryRoutes)

server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`) 
})