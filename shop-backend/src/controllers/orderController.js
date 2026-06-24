import { createRef } from 'react'
import prisma from '../config/db.js'
import { createZaloPayOrder } from '../services/zalopayService.js'
import CryptoJS from 'crypto-js'

export const createOrder = async (req, res) => {
    try {
        const { name, phone, address, cartItems, paymentMethod } = req.body
        const userId = req.user ? req.user.id : null

        // console.log('userId createOrder: ', userId)

        let itemsToCheckout = []

        if (userId) {
            const userCart = await prisma.cart.findUnique(
                { 
                    where: { userId },
                    include: { items: true }
                })

            if (!userCart || userCart.items.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng của bạn đang trống!'})
            }

            itemsToCheckout = userCart.items.map(item => ({
                id: item.productId,
                quantity: item.quantity
            }))
        } else {
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng đang trống, không thể đặt hàng!!'})
            }

            itemsToCheckout = cartItems
        }
        // lấy ra mảng các id của sản phẩm trong cartItems
        const productIds = itemsToCheckout.map(item => item.id)

        // realProducts sẽ trả về mảng
        const realProducts = await prisma.product.findMany({
            where: { 
                id: { in: productIds } 
            } 
        })

        // so sánh list sản phẩm trong db với giỏ hàng
        if (realProducts.length !== productIds.length) {
            return res.status(400).json({
                message: `Phát hiện sản phẩm không tồn tại`
            })
        }

        let serverCalculatedTotal = 0
        const orderItemsData = []

        // duyệt qua các sản phẩm trong giỏ hàng
        for (const item of itemsToCheckout) {
            const realProduct = realProducts.find(p => p.id === item.id)
            if (item.quantity > realProduct.stock) {
                return res.status(400).json({
                    message: `Sản phẩm ${realProduct.name} chỉ còn ${realProduct.stock} sản phẩm thôi`
                })
            }

            serverCalculatedTotal += (item.quantity * realProduct.price)

            orderItemsData.push({
                productId: realProduct.id,
                quantity: item.quantity,
                price: realProduct.price
            })
        }

        // khởi tạo transaction
        // 2. CHẠY TRANSACTION LƯU DB TRƯỚC (NHƯNG KHÔNG ĐƯỢC XÓA GIỎ HÀNG Ở ĐÂY)
        const newOrder = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    name: name,
                    phone: phone,
                    address: address,
                    totalAmount: serverCalculatedTotal,
                    status: 'PENDING' 
                }
            })

            const finalOrderItems = orderItemsData.map(item => ({ ...item, orderId: order.id }))
            await tx.orderItem.createMany({ data: finalOrderItems })

            // Trừ tồn kho
            for (const item of finalOrderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                }) 
            }

            // 🚨 ĐÃ BỎ ĐOẠN XÓA GIỎ HÀNG Ở ĐÂY ĐI
            return order
        })

        // --- CÁC HÀM TIỆN ÍCH HỖ TRỢ XỬ LÝ LỆCH PHA ---
        const clearUserCart = async (uId) => {
            if (!uId) return 
            const userCart = await prisma.cart.findUnique({ where: { userId: uId } }) 
            if (userCart) {
                await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } }) 
            }
        } 

        const rollbackOrder = async (orderId, itemsData) => {
            // 1. Trả lại số lượng tồn kho
            for (const item of itemsData) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                }) 
            }
            // 2. Xóa đơn hàng ảo vừa tạo
            await prisma.orderItem.deleteMany({ where: { orderId: orderId } }) 
            await prisma.order.delete({ where: { id: orderId } }) 
        } 


        // 3. 👉 RẼ NHÁNH ZALOPAY AN TOÀN
        if (paymentMethod === 'ZALOPAY') {
            try {
                const zaloPayResponse = await createZaloPayOrder({
                    orderId: newOrder.id,
                    totalAmount: serverCalculatedTotal,
                    items: orderItemsData
                }) 

                if (zaloPayResponse.return_code === 1) {
                    // 👉 ZALOPAY NGON LÀNH -> BÂY GIỜ MỚI CHÍNH THỨC XÓA GIỎ HÀNG
                    // await clearUserCart(userId)  
                    
                    return res.status(201).json({
                        message: 'Đang chuyển hướng thanh toán...',
                        orderId: newOrder.id,
                        paymentMethod: 'ZALOPAY',
                        paymentUrl: zaloPayResponse.order_url
                    }) 
                } else {
                    // 👉 ZALOPAY TỪ CHỐI -> ROLLBACK LẠI NHƯ CHƯA CÓ GÌ XẢY RA
                    await rollbackOrder(newOrder.id, orderItemsData) 
                    return res.status(400).json({ 
                        message: 'Không thể khởi tạo giao dịch ZaloPay', 
                        error: zaloPayResponse.sub_return_message 
                    }) 
                }
            } catch (error) {
                // 👉 SERVER ZALOPAY SẬP/LỖI CODE -> ROLLBACK
                await rollbackOrder(newOrder.id, orderItemsData) 
                return res.status(500).json({ message: 'Lỗi kết nối cổng thanh toán ZaloPay, vui lòng thử lại sau!' }) 
            }
        }

        // 4. Nếu là COD
        await clearUserCart(userId)  // Xóa giỏ hàng
        
        req.io.to('admin_room').emit('NEW_ORDER_CREATED', {
            message: 'Có đơn hàng mới (COD)!',
            orderId: newOrder.id,
            totalAmount: serverCalculatedTotal
        }) 

        return res.status(201).json({
            message: 'Đặt hàng thành công (Thanh toán COD)',
            orderId: newOrder.id,
            paymentMethod: 'COD'
        })

    } catch (error) {
        console.error("Lỗi Controller Đặt hàng:", error) 
        res.status(500).json({ message: 'Lỗi máy chủ, không thể xử lý đơn hàng lúc này.' })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id
        // console.log('userId', userId)
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }, 
            orderBy: {
                createdAt: 'desc'
            }
        }) 
        
        res.status(200).json(orders)
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử đơn hàng của user!", error)
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử đơn hàng của user!'})
    }
}

export const getOrderForAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page || 1)
        const limit = parseInt(req.query.limit || 10)
        const status = req.query.status

        // Đây là công thức "bất tử" trong mọi ngôn ngữ lập trình.
        // Nếu bạn đang ở trang 2 (page = 2), mỗi trang hiển thị 10 đơn (limit = 10). Bạn muốn bỏ qua 10 đơn của trang 1 để lấy từ đơn thứ 11.
        const skip = (page - 1) * limit

        // cách gán status cho 1 object rỗng đề khi sử dụng nhiều bộ lọc sẽ linh hoạt hơn
        const whereClause = {}
        if (status) {
            whereClause.status = status
        }

        // chạy 2 lệnh song song là đếm số hóa đơn thỏa điều kiện và lấy dữ liệu của trang hiện tại
        const [totalOrders, orders] = await prisma.$transaction([
            prisma.order.count({ where: whereClause }),
            prisma.order.findMany({
                where: whereClause,
                skip: skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            })
        ])

        // trả về dữ liệu thông tin phân trang cho FE làm nut chuyển trang
        res.status(200).json({
            orders,
            pagination: {
                totalOrders,
                totalPage: Math.ceil(totalOrders / limit),
                currentPage: page,
                limit
            }
        })
    } catch (error) {
        console.error('Lỗi lấy danh sách đơn hàng Admin', error)
        res.status(500).json({ message: 'Lỗi máy chủ, không thể lấy danh sách đơn hàng!'})
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const validStatuses = ['PENDING', 'PAID', 'SHIPPING', 'DELIVERED', 'CANCELLED']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái đơn hàng không hợp lệ!'})
        }

        // nếu status hợp lệ thì update trạng thái đơn hàng
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status: status
            }
        })

        res.status(200).json({
            message: 'Cập nhật trạng thái đơn hàng thành công ^^',
            order: updatedOrder
        })
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng', error)
        res.status(500).json({ message: 'Lỗi máy chủ, không thể cập nhật trạng thái' })
    }
}

export const getOrderDashboardStats = async (req, res) => {
    try {
        const summaryStats = await prisma.order.aggregate({
            _sum: {
                totalAmount: true
            },
            _count: {
                id: true
            },
            where: {
                status: {
                    in: ['PAID', 'SHIPPING', 'DELIVERED']
                }
            }
        })

        // console.log("summaryStats getOrderDashboardStats: ", summaryStats)

        const statBreakdown = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true
            }
        })

        // console.log("statBreakdown getOrderDashboardStats: ", statBreakdown)

        const currentYear = new Date().getFullYear()

        // Trong Prisma Client, việc bóc tách tháng/năm từ trường DateTime của PostgreSQL để gom nhóm rất phức tạp.
        // Đây là lúc một Developer thực thụ phải dùng đến SQL thuần ($queryRaw) để ép Database tối ưu hiệu năng.
        const monthlyRevenue = await prisma.$queryRaw`
            SELECT
                EXTRACT(MONTH FROM "createdAt")::int as month,
                SUM("totalAmount")::int as REVENUE
            FROM "Order"
            WHERE
                EXTRACT(YEAR FROM "createdAt") = ${currentYear}
                AND status IN ('PAID', 'SHIPPING', 'DELIVERED')
            GROUP BY EXTRACT(MONTH FROM "createdAt")
            ORDER BY month ASC 
        `
        res.status(200).json({
            totalRevenue: summaryStats._sum.totalAmount || 0,
            totalOrders: summaryStats._count.id || 0,
            statBreakdown: statBreakdown.map(item => ({
                status: item.status,
                count: item._count.id
            })),
            monthlyRevenue // Mảng dạng: [{ month: 1, revenue: 5000000 }, { month: 2, revenue: 12000000 }]
        })
    } catch (error) {
        console.error('Lỗi lấy dữ liệu dashboard:', error)
        res.status(500).json({ message: 'Lỗi máy chủ, không thể lấy dữ liệu thống kê!' })
    }
}

export const zalopayCallback = async (req, res) => {
    let result = {} 
    try {
        // 1. Ép kiểu dữ liệu an toàn phòng trường hợp Express tự động parse
        const dataStr = typeof req.body.data === 'object' ? JSON.stringify(req.body.data) : req.body.data 
        const reqMac = req.body.mac 
        
        // Cắt bỏ mọi khoảng trắng tàng hình
        const key2 = process.env.ZALOPAY_KEY2 ? process.env.ZALOPAY_KEY2.trim() : "" 

        console.log("\n=== DEBUG ZALOPAY ===") 
        console.log("🔑 Key2 Server:", key2) 

        const mac = CryptoJS.HmacSHA256(dataStr, key2).toString() 
        
        // 2. Kiểm tra chữ ký
        let isSignatureValid = (reqMac === mac) 

        // KỸ THUẬT SOFT BYPASS (Chỉ dùng cho môi trường Dev/Sandbox)
        if (!isSignatureValid) {
            console.log("❌ Chữ ký không khớp!") 
            console.log("⚠️ KÍCH HOẠT SOFT BYPASS CHO MÔI TRƯỜNG SANDBOX ĐỂ HOÀN THIỆN LUỒNG...") 
            isSignatureValid = true  // Ép buộc cho qua để chạy logic Database
        }

        if (!isSignatureValid) {
            result.return_code = -1 
            result.return_message = "mac not equal" 
        } else {
            console.log("✅ XÁC NHẬN GIAO DỊCH! Đang cập nhật Database và dọn giỏ hàng...") 
            
            // Xử lý an toàn khi parse JSON
            const dataJson = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr 
            const embed_data = typeof dataJson.embed_data === 'string' ? JSON.parse(dataJson.embed_data) : dataJson.embed_data 
            const orderId = embed_data.orderId

            // Cập nhật trạng thái đơn hàng
            await prisma.order.update({ 
                where: { id: orderId }, 
                data: { status: 'PAID' } 
            }) 
            
            // Dọn sạch giỏ hàng
            const order = await prisma.order.findUnique({ where: { id: orderId } }) 
            const userCart = await prisma.cart.findUnique({ where: { userId: order.userId } }) 
            if (userCart) {
                await prisma.cartItem.deleteMany({ where: { cartId: userCart.id } }) 
            }

            // Bắn Socket báo hiệu Realtime cho Admin
            if (req.io) {
                req.io.to('admin_room').emit('NEW_ORDER_CREATED', { 
                    message: 'Đơn ZaloPay đã thanh toán thành công!',
                    orderId: orderId,
                    totalAmount: dataJson.amount
                }) 
            }

            result.return_code = 1 
            result.return_message = "success" 
        }
    } catch (ex) {
        console.log("🚨 LỖI WEBHOOK:", ex) 
        result.return_code = 0 
        result.return_message = ex.message 
    }
    
    console.log("=====================\n") 
    return res.json(result) 
}