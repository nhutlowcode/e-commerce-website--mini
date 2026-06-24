import pkg1 from 'cloudinary'
import pkg2 from 'multer-storage-cloudinary'
import multer from 'multer'
import 'dotenv/config'

const { v2: cloudinary } = pkg1

const { CloudinaryStorage } = pkg2


// Cấu hình chìa khóa để vào nhà CLoudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// Thiết lập kho lưu trữ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'MinhNhutShop_Products',
        allowFormats: ['jpeg', 'png', 'jpg', 'webp']
    }
})

const upload = multer({ storage: storage})

export default upload