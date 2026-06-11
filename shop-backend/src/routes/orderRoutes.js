import express from 'express'
import { createOrder } from '../controllers/orderController.js'
import { optionalAuth } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post('/', optionalAuth, createOrder)

export default router