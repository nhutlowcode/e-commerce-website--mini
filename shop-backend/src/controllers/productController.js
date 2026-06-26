import prisma from '../config/db.js'

// 1. lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
    try {
        const { keyword, minPrice, maxPrice, page = 1, limit = 12 } = req.query
        const whereClause = {}

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const totalItems = await prisma.product.count({ where: whereClause });
        const totalPages = Math.ceil(totalItems / parseInt(limit));

        // nếu có nhập từ khóa thì lọc ra những sản phẩm mà tên chứa từ khóa đó
        if (keyword) {
            whereClause.name = {
                // contains là thuộc tính của prisma, đặt key như vậy để khi đưa vào prisma thì nó nhận được
                contains: keyword,
                mode: 'insensitive'
            }
        }

        if (minPrice || maxPrice) {
            whereClause.price = {}
            if (minPrice)  whereClause.price.gte = parseInt(minPrice)
            if (maxPrice)  whereClause.price.lte = parseInt(maxPrice)
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: parseInt(limit)
        })

        res.status(200).json({
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems,
                limit: parseInt(limit)
            }
        })
    } catch (error) {
        console.error('Lỗi Prisma: ', error)
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' })
    }
}

// 2 Lấy chi tiết 1 sản phẩm theo id
export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id
        const product = await prisma.product.findUnique({
            where: {
                id: parseInt(productId)
            },
            include: {
                category: true
            }
        })

        if (!product) {
           return res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
        }

        res.status(200).json(product)
    } catch (error) {
        console.error('Lỗi Prisma: ', error)
        res.status(500).json({ message: 'Lỗi khi tìm sản phẩm theo Id'})
    }
}

// 3. Thêm 1 sản phẩm mới
export const createProduct = async(req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body

        // lấy đường link ảnh do multer và cloudinary trả về qua req.file.path
        const imageUrl = req.file ? req.file.path : ''

        if (!name || !description || !price || !imageUrl) {
            return res.status(400).json({ message: 'Phải điền đầy đủ thông tin sản phẩm' })
        }
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseInt(price),
                stock: parseInt(stock || 0), // Lấy stock, mặc định là 0 nếu FE quên gửi
                categoryId: parseInt(categoryId), // Gắn vào danh mục
                image: imageUrl
            }
        })
        res.status(201).json(newProduct)
    } catch (error) {
        console.error('Lỗi Prisma: ', error)
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm mới' })
    }
}

// 4. Xóa 1 sản phẩm
export const deleteProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)
        await prisma.product.delete({
            where: {
                id: productId
            }
        })
        res.status(200).json({ message: 'Sản phẩm đã được xóa thành cônng' })
    } catch (error) {
         console.error('Lỗi Prisma: ', error)
         res.status(500).json({ message: 'Lỗi khi xóa sản phẩm!' })
    }
}

// 5. Sửa 1 sản phẩm 
export const updateProduct = async (req, res) => {
    try {
        const productId = parseInt(req.params.id)
        const { name, description, price } = req.body

        const updateData = {
            name: name,
            description: description,
            price: parseInt(price)
        }

        // kiểm tra xem admin có gửi ảnh mới lên không
        if (req.file) {
            updateData.image = req.file.path
        }

        const upadateProduct = await prisma.product.update({
            where: {
                id: productId
            },
            data: updateData
        })
        res.status(200).json(upadateProduct)
    } catch (error) {
        console.error("Lỗi prisma: ", error)
        res.status(500).json({ message: 'Lõi khi sứa sản phẩm' })
    }
}
