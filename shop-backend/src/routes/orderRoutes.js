import express from 'express'
import { createOrder, getMyOrders, getOrderDashboardStats, getOrderForAdmin, updateOrderStatus, zalopayCallback } from '../controllers/orderController.js'
import { isAdmin, optionalAuth, protectRoutes } from '../middlewares/authMiddleware.js'
import { validateOrder } from '../validations/orderValidation.js'



const router = express.Router()

router.post('/', optionalAuth, validateOrder, createOrder)
router.get('/my-orders', optionalAuth, getMyOrders)
router.get('/admin', protectRoutes, isAdmin, getOrderForAdmin)
router.put('/admin/:id', protectRoutes, isAdmin, updateOrderStatus)
router.get('/dashboard-stats', protectRoutes, isAdmin, getOrderDashboardStats)

router.post('/zalopay-callback', zalopayCallback);

export default router