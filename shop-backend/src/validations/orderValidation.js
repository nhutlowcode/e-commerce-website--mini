import Joi from 'joi'

// 1. Khai báo "Luật" cho cái đơn hàng
const orderSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Họ và tên không được để trống.',
        'string.min': 'Họ và tên phải có ít nhất 3 ký tự.',
        'any.required': 'Trường họ và tên là bắt buộc.'
    }),
    
    // Dùng lại đúng đoạn Regex giống bên Frontend để đồng bộ 100%
    phone: Joi.string().pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/).required().messages({
        'string.empty': 'Số điện thoại không được để trống.',
        'string.pattern.base': 'Số điện thoại Việt Nam không hợp lệ.',
        'any.required': 'Trường số điện thoại là bắt buộc.'
    }),
    
    address: Joi.string().required().messages({
        'string.empty': 'Địa chỉ giao hàng không được để trống.'
    }),
    
    // cartItems phải là 1 mảng, và bèo nhất phải có 1 món đồ
    cartItems: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(), // Đảm bảo ID là số nguyên (cho Prisma)
            quantity: Joi.number().integer().min(1).required(), // Số lượng bèo nhất là 1
            price: Joi.number().optional() // Ta không xài price này, nhưng cho phép Frontend gửi lên mà không báo lỗi
        })
    ).min(1).required().messages({
        'array.min': 'Giỏ hàng phải có ít nhất 1 sản phẩm.',
        'any.required': 'Thiếu dữ liệu giỏ hàng.'
    }),

    totalAmount: Joi.number().optional() 
}) 

// 2. Tạo Middleware gác cổng
export const validateOrder = (req, res, next) => {
    // Kiểm tra req.body đối chiếu với bộ luật ở trên
    // abortEarly: false giúp Joi kiểm tra hết toàn bộ các lỗi rồi mới báo cáo 1 thể, thay vì thấy 1 lỗi là dừng luôn
    const { error } = orderSchema.validate(req.body, { abortEarly: false }) 

    if (error) {
        // Gom tất cả các câu báo lỗi lại thành một mảng và trả về cho Frontend
        const errorMessages = error.details.map(detail => detail.message) 
        return res.status(400).json({ 
            message: 'Dữ liệu đầu vào không hợp lệ!', 
            errors: errorMessages 
        }) 
    }

    // Nếu dữ liệu sạch sẽ, cho phép đi tiếp vào Controller
    next()
} 