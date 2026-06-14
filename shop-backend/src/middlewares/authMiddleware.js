import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'

export const protectRoutes = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy accessToken!'})
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error("Có lỗi khi xác thực: ", err)
                return res.status(401).json({ message: 'accessToken không hợp lệ hoặc đã hết hạn!'})
            }

            const user = await prisma.user.findUnique({                                        
                where: {
                    id: decoded.id
                }
            })

            if (!user) {
                return res.status(404).json({ message: 'Người dùng này không tồn tại!' })
            }

            const { password: _, ...userWithoutPassword } = user

            req.user = userWithoutPassword

            next()
        })
    } catch (error) {
        console.log('Lỗi khi gọi lấy accesstoken', error)
        return res.status(500).json({ message: 'Lỗi hệ thống!'})
    }
}

export const isAdmin = async (req, res, next) => {
        if (req.user.role === 'ADMIN') {
            return next()
        } else {
            return res.status().json({ message: 'Từ chối truy cập, chỉ admin mới được quyền truy cập!'})
        }
}

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['Authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (!token) {
           return next()
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'accessToken không hợp lệ hoặc đã hết hạn!'})
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
                }
            })

            if (user) {
                const { password: _, userWithoutPassword } = user
                req.user = userWithoutPassword
            }

            next()
        })

    } catch (error) {
        console.log('Lỗi ở optionalAuth', error)
        res.status(500).json({ message: 'Lỗi hệ thống!'})
    }
}