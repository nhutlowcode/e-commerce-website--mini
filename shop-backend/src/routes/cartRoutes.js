import express from 'express'
import { getCart, addToCart, mergeCart, removeItem, updateItemQuantity } from '../controllers/cartController.js'
import { protectRoutes } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protectRoutes, getCart)
router.post('/', protectRoutes, addToCart)
router.post('/merge', protectRoutes, mergeCart)
router.delete('/:productId', protectRoutes, removeItem)
router.put('/:productId', protectRoutes, updateItemQuantity)

export default router