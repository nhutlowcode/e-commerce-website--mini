import express from 'express'
import { createOrder, getOrderForAdmin, updateOrderStatus } from '../controllers/orderController.js'
import { isAdmin, optionalAuth, protectRoutes } from '../middlewares/authMiddleware.js'
import { validateOrder } from '../validations/orderValidation.js'


const router = express.Router()

router.post('/', optionalAuth, validateOrder, createOrder)
router.get('/admin', protectRoutes, isAdmin, getOrderForAdmin)
router.put('/admin/:id', protectRoutes, isAdmin, updateOrderStatus)

export default router