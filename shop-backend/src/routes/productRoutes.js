import express from 'express'
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js'
import { protectRoutes, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// private routes
router.post('/', protectRoutes, isAdmin, createProduct)
router.put('/:id', protectRoutes, isAdmin, updateProduct)
router.delete('/:id', protectRoutes, isAdmin, deleteProduct)

export default router