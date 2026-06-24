import { PrismaPg } from '@prisma/adapter-pg'
import prisma from '../config/db.js'

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id

        // tìm cart của user đó
        let cart = await prisma.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        // nếu chưa có thì tạo cart cho user đó
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: userId },
                include: {
                    items: true
                }
            })
        }

        res.status(201).json(cart)
    } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy giỏ hàng!' });
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = parseInt(req.user.id)
        // console.log('userId: ', userId)
        const { productId, quantity } = req.body

        // đảm bảo user này có giỏ hàng rồi
        let cart = await prisma.cart.findUnique({ where: { userId: userId }})

        // nếu chưa có thì tạo cart mới
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId }})
        }
        
        // kiểm tra xem món đã có trong giỏ chưa
        const existingItem = await prisma.cartItem.findUnique({ 
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            }
        })

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + parseInt(quantity)
                }
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity: parseInt(quantity)
                }
            })
        }

        // trả về toàn bộ cart mới nhất cho FE
        const updateCart = await prisma.cart.findUnique({
            where: { userId: userId},
            include: { items: { include: { product: true } } }
        })

        res.status(200).json(updateCart)
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật giỏ hàng!' })
    }
}

export const removeItem = async (req, res) => {
    try {
        const userId = req.user.id
        // lấy id của sản phẩm cần xóa từ query của url
        const { productId } = req.params

        //kiểm tra xem cart của user đó có tồn tại hay không
        const cart = await prisma.cart.findUnique({
            where: { userId }
        })

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng!'})
        }

        // nếu có cart thì tiến hành xóa cartItem theo id item đã lấy được
        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            }
        })

        // sau khi xóa xong cần truy vấn lại dữ liêu mới nhất sau khi xóa
        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        res.status(200).json(updatedCart)
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", error)
        res.status(500).json({ message: 'Lỗi server khi xóa món hàng' })
    }
}

export const mergeCart = async (req, res) => {
    try {
        const userId = req.user.id
        const { localCart } = req.body

        if (!localCart || localCart.legnth === 0) {
            return res.status(200).json({ message: 'Không có giỏ hàng để gộp'})
        }

        let cart = await prisma.cart.findUnique({
            where: { userId }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            })
        }

        for (const item of localCart) {
            const exsitingItem = await prisma.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId: item.id
                    }
                }
            })

            if (exsitingItem) {
                await prisma.cartItem.update({
                    where: { id: exsitingItem.id },
                    data: {
                        quantity: exsitingItem.quantity + parseInt(item.quantity)
                    }
                })
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: parseInt(item.id),
                        quantity: parseInt(item.quantity)
                    }
                })
            }
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                         product: true
                    }
                }
            }
        })

        res.status(200).json(updatedCart)
    } catch (error) {
        console.error('Lỗi khi gộp giỏ hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi gộp giỏ hàng!' });
    }
}

export const updateItemQuantity = async (req, res) => {
    try {
        const userId = req.user.id
        const { productId } = req.params
        const { quantity } = req.body

        console.log(`🚨 DỮ LIỆU FE GỬI XUỐNG - ProductID: ${productId} | Số lượng: ${quantity}`)

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Số lượng không được bé hơn 0'})
        }

        // tìm xem user này có cart chưa
        const cart = await prisma.cart.findUnique({ where: { userId } })
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' })
        }

        // mếu có rồi thì tiên hành cập nhật lại số lượng của item trong cart
        await prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            },
            data: {
                quantity: parseInt(quantity)
            }
        })

        // lấy data mới nhất sau khi update
        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        res.status(200).json(updatedCart)

    } catch (error) {
        console.error("Lỗi khi cập nhật số lượng giỏ hàng: ", error)
        res.status(500).json({ message: 'Lỗi khi cập nhật số lượng giỏ hàng' })
    }
}