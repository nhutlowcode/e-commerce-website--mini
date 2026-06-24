import express from 'express'
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js'
import { protectRoutes, isAdmin } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// public routes
router.get('/', getProducts)
router.get('/:id', getProductById)

// private routes
router.post('/', protectRoutes, isAdmin, upload.single('image'), createProduct) // 'image' là mật khẩu để multer có thể nhận
router.put('/:id', protectRoutes, isAdmin, upload.single('image'), updateProduct)
router.delete('/:id', protectRoutes, isAdmin, deleteProduct)

export default router