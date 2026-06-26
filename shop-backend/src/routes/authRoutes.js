import express from 'express'
import { login, register, refreshToken, forgotPassword, resetPassword, googleLogin } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/google', googleLogin)

export default router