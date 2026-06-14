import prisma from '../config/db.js'

// 1. lấy danh sách sản phẩm
export const getProducts = async (req, res) => {
    try {
        const { keyword, minPrice, maxPrice } = req.query
        const whereClause = {}

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
            if (maxPrice)  whereClause.price.lte = parseInt(minPrice)
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.status(200).json(products)
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
            }
        })
        if (!product) {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' })
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
        const { name, description, price, image } = req.body

        if (!name || !description || !price || !image) {
            alert('Phải điền đẩy đủ thông tin sản phẩm')
        }
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseInt(price),
                image

            }
        })
        res.status(201).json(newProduct)
    } catch (error) {
        console.error('Lỗi Prisma: ', error)
        res.status().json({ message: 'Lỗi khi thêm sản phẩm mới' })
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
        const productId = req.params.id
        const { name, description, price, image } = req.body
        const upadateProduct = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                name: name,
                description: description,
                price: parseInt(price),
                image: image
            }
        })
        res.status(200).json(upadateProduct)
    } catch (error) {
        console.error("Lỗi prisma: ", error)
        res.status(500).json({ message: 'Lõi khi sứa sản phẩm' })
    }
}
