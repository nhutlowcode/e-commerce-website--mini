import prisma from '../config/db.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../utils/sendEmail.js'

const ACCESS_TOKEN_TTL = '1d'
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000

// test 
// const ACCESS_TOKEN_TTL = '5s'
// const REFRESH_TOKEN_TTL = 10 * 1000


export const register = async (req, res) => {
    try {
        const { email, password, name } = req.body
        const existedUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        
        if (existedUser) {
            return res.status(400).json({ message: 'email đã tồn tại!'})
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10), 
                name
            }
        })

        // Tách mật khẩu ra khỏi kết quả trả về để bảo mật (dấu '_' quy ước thuộc tính sẽ bị loại bỏ, password sau dấu : là đổi tên)
        const { password: _, ...userWithoutPassword } = newUser 

        res.status(201).json({
            message: 'Đăng ký tài khoản thành công',
            user: userWithoutPassword
        })

    } catch (error) {
        console.error('Lỗi prisma: ', error)
        res.status(500).json({ message: 'Lỗi khi đăng kí tài khoản!' })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userAgent = req.headers['user-agent']

        if (!email) {
            return res.status(500).json({ message: 'Thiếu email hoặc password!'})
        }
         const existedUser = await prisma.user.findUnique({
            where: {
                email
            }
         })

         if (!existedUser) {
            return res.status(500).json({ message: 'Email này không tồn tại!'})
         }
         const correctPassword = await bcrypt.compare(password, existedUser.password)

         if (!correctPassword) {
            return res.status(500).json({ message: 'Email hoặc mật khẩu không chính xác!'})
         }
         const accessToken = jwt.sign(
            { 
                id: existedUser.id,
                role: existedUser.role
            }
          , process.env.JWT_SECRET, 
          { expiresIn: ACCESS_TOKEN_TTL })

          const refreshToken = crypto.randomBytes(64).toString('hex')

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_TTL
          })

          await prisma.session.create({
            data: {
                token: refreshToken,
                userId: existedUser.id,
                userAgent: userAgent,
                expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
            }
          })

          const { password: _, ...userWithoutPassword } = existedUser

          res.status(200).json({
            message: 'Đăng nhập thành công',
            accessToken,
            user: userWithoutPassword
          })
    } catch (error) {
        console.error('Lỗi prisma: ', error)
        res.status(500).json({ message: 'Lỗi khi đăng nhập'})
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy refreshToken!'
            })
        }

        const session = await prisma.session.findFirst({
            where: {
                token
            },
            include: {
                user: true
            }
        })
        
        if (new Date() > session.expiresAt) {
            await prisma.session.delete({
                where: {
                    id: session.id
                }
            })
            res.clearCookie('refreshToken')
            return res.status().json({ message: 'Phiên đăng nhập này đã hết hạn!' })
        }

        const newAccessToken = jwt.sign(
            {
                id: session.user.id,
                role: session.user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        )

        res.status(200).json({
            accessToken: newAccessToken
        })
    } catch (error) {
        console.error('Lỗi khi gia hạn token: ', error)
        res.status(500).json({ message: 'Lỗi hệ thống khi gia hạn token' })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email đã đăng ký!'})
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            return res.status(404).json({ message: 'Email này chưa được đăng ký!'})
        }

        const resetToken = crypto.randomBytes(64).toString('hex')

        const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000 ) // token hết hạn sau 15p

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetPasswordExpires
            }
        })

        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`

        const htmlContent = `
            <h3>Xin chào ${user.name || 'bạn'},</h3>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu tại Minh Nhut Shop. Vui lòng bấm vào nút dưới đây để đổi mật khẩu mới (Link có hiệu lực trong 15 phút):</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Đổi Mật Khẩu</a>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        `
        await sendEmail({ to: user.email, subject: `Link Reset Password`, html: htmlContent})
        res.status(200).json({ message: 'Link khôi phục tài khoản đã được gửi vào email của bạn'})
    } catch (error) {
        console.error("Lỗi ở forgotPassword ", error)
        res.status(500).json({ message: 'Lỗi hệ thống khi yêu cầu quên mật khẩu.'})
    }
}


const user = await prisma.user.findUInique({
    where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
            gt: Date.now()
        }
    }
})