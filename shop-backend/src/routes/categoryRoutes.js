import express from 'express'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/categoryController.js'
import { protectRoutes, isAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protectRoutes, isAdmin, getCategories)
router.post('/', protectRoutes, isAdmin, createCategory)
router.put('/:id', protectRoutes, isAdmin, updateCategory)
router.delete('/:id', protectRoutes, isAdmin, deleteCategory)

export default router