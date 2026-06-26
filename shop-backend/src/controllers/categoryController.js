import { PrismaPg } from '@prisma/adapter-pg'
import prisma from '../config/db.js'

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany() 
        res.status(200).json(categories) 
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh mục" }) 
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body
         if (!name) {
            return res.status(400).json({ message: 'Vui lòng nhập tên loại sản phẩm.' })
         }

         const existedCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
         })

         if (existedCategory) {
            return res.status(400).json({ message: 'Tên loại sản phẩm này đã tồn tại.' })
         }

         const newCategory = await prisma.category.create({
            data: {
                name
            }
         })

         res.status(201).json(newCategory)
    } catch (error) {
        console.error('Lỗi ở createCategory: ', error)
        res.status(500).json({ message: 'Lỗi khi thêm loại sản phẩm.' })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name) {
            return res.status(400).json({  message: 'Vui lòng nhập tên loại cần sửa.' })
        }

        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
         })

        if (!category) {
            return res.status(404).json({ message: 'Loại sản phẩm này không tồn tại.' })
        } 

        // CHỐT CHẶN LOGIC: Tên mới sửa không được trùng với các danh mục KHÁC đã có trong hệ thống
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive' // Áp dụng ở đây luôn
                },
                NOT: { id: parseInt(id) } // Loại trừ chính nó ra, tránh tự trùng với chính mình
            }
        })

        if (duplicateCategory) {
            return res.status(400).json({ message: 'Tên loại sản phẩm này đã được sử dụng!' })
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: category.id
            },
            data: {
                name
            }
        })

        res.status(200).json(updatedCategory)
    } catch (error) {
        console.error('Lỗi ở updateCategory: ', error)
        res.status(500).json({ message: 'Lỗi khi sửa loại sản phẩm.' })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        
        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        if (!category) {
            return res.status(400).json({ message: 'Không tìm thấy loại sản phẩm này.' })
        }

        await prisma.category.delete({
            where: {
                id: category.id
            }
        })
        res.status(200).json({ message: 'Loại sản phẩm đã được xóa thành công.' })
    } catch (error) {
        console.error('Lỗi ở deleteCategory: ', error)
        res.status(500).json({ message: 'Lỗi khi xóa loại sản phẩm.' })
    }
}