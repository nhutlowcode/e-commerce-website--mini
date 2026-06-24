import { useState, useEffect } from 'react' 
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCartAction } from '../redux/cartSlice.js'

function ProductDetail() {

    const dispatch = useDispatch()

    // láy id từ thanh địa chỉ URL
    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Không tìm thấy sản phẩm này!')
                }
                return res.json()
            })
            .then((data) => {
                setProduct(data)
                setLoading(false)
            })
            .catch((error) => {
                setError(error)
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
                    className='w-full max-h-[500px] object-contain'
                />
            </div>

            {/* Cột phải: thông tin */}
            <div className='flex flex-col justify-center'>
                <h1 className='text-4xl font-bold text-gray-800 mb-4'>{product.name}</h1>
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