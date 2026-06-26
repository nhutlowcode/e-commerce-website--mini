import { useState, useEffect } from 'react' 
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCartAction } from '../redux/cartSlice.js'
import axiosInstance from '../utils/axiosConfig.js'

function ProductDetail() {

    const dispatch = useDispatch()

    // láy id từ thanh địa chỉ URL
    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

   useEffect(() => {
        axiosInstance.get(`/api/products/${id}`)
            .then((res) => {
                setProduct(res.data)
                setLoading(false)
            })
            .catch((err) => {
                // Xử lý lỗi chuẩn xác, an toàn cho React
                setError(err.response?.data?.message || 'Không thể tải thông tin sản phẩm!')
                setLoading(false)
            })
    }, [id])

    if (loading) return <div className="text-center mt-20 text-xl">Đang tải dữ liệu...</div> 
    if (error) return <div className="text-center mt-20 text-xl text-red-500">{error}</div> 
    if (!product) return null 

  return (
    <main className='max-w-6xl mx-auto p-6 mt-12 mb-20'>
        <Link to='/' className='text-blue-500 hover:underline mb-6 inline-block'>
            &larr  Quay lại trang chủ
        </Link>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
            {/* Cột trái: hình ảnh */}
            <div className='rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center'>
                <img 
                    src={product.image}
                    alt={product.name}
                    className='w-full max-h-125 object-contain'
                />
            </div>

            {/* Cột phải: thông tin */}
            <div className='flex flex-col justify-center'>
                <h1 className='text-4xl font-bold text-gray-800 mb-4'>{product.name}</h1>
                {/* THÊM KHỐI NÀY: Hiển thị Danh mục và Số lượng */}
                <div className='flex items-center gap-4 mb-4 text-sm font-medium'>
                    <span className='bg-gray-100 text-gray-600 px-3 py-1 rounded-full'>
                        {/* Dùng optional chaining (?) để đề phòng lỗi nếu category bị null */}
                        Danh mục: {product.category?.name || 'Chưa phân loại'}
                    </span>
                    <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Đã hết hàng'}
                    </span>
                </div>
                <p className='text-3xl text-blue-600 font-semibold mb-6'>
                    {product.price.toLocaleString('vi-VN')} đ
                </p>

                <div className='mb-8'>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>Mô tả sản phẩm</h3>
                    <p className='text-gray-600 leading-relaxed'>{product.description}</p>
                </div>

                <button 
                    className='bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-blue-200 w-full md:w-auto'
                    onClick={() => dispatch(addToCartAction(product))}
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </main>
  )
}

export default ProductDetail