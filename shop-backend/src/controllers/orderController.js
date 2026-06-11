import prisma from '../config/db.js'

export const createOrder = async (req, res) => {
    try {
        const { name, phone, address, cartItems, totalAmount } = req.body
        const userId = req.user ? req.user.id : null

        if (!cartItems || cartItems.length === 0) {
           return res.status(400).json({ message: 'Giỏ hàng đang trống, không thể đặt hàng!!'})
        }

        // lấy ra mảng các id của sản phẩm trong cartItems
        const productIds = cartItems.map(item => item.id)

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

        let serverCaculatedTotal = 0
        const orderItemsData = []

        // duyệt qua các sản phẩm trong giỏ hàng
        for (const item of cartItems) {
            const realProduct = realProducts.find(p => p.id === item.id)
            if (item.quantity > realProduct.stock) {
                return res.status(400).json({
                    message: `Sản phẩm ${realProduct.name} chỉ còn ${realProduct.stock} sản phẩm thôi`
                })
            }

            serverCaculatedTotal += (item.quantity * realProduct.price)

            orderItemsData.push({
                productId: realProduct.id,
                quantity: item.quantity,
                price: realProduct.price
            })
        }

        // khởi tạo transaction
        const newOrder = await prisma.$transaction(async (tx) => {
            // tạo đơn hàng tổng trước để lấy id đơn
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    name: name,
                    phone: phone,
                    address: address,
                    totalAmount: totalAmount,
                    status: 'PENDING'
                }
            })

            // thông tin của mỗi sản phẩm trong đơn hàng (lấy dữ liệu từ cartItems)
            const finalOrderItems = orderItemsData.map(item => ({
                ...item,
                orderId: order.id 
            }))

            // lưu mỗi sản phẩm vào orderItem
            await tx.orderItem.createMany({
                data: finalOrderItems
            })

            // trừ tồn kho cho mỗi sản phẩm sau khi đặt hàng thành công
            for (const item of finalOrderItems) {
                await tx.product.update({
                    where: {
                        id: item.productId
                    },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                }) 
            }

            // trả về cái đơn hàng đã tạo ban đầu
            return order
        })

        res.status(201).json({
            message: 'Tạo đơn hàng thành công',
            orderId: newOrder.id
        })
    } catch (error) {
        console.error("Lỗi Controller Đặt hàng:", error);
        res.status(500).json({ message: 'Lỗi máy chủ, không thể xử lý đơn hàng lúc này.' })
    }
}