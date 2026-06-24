import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCartAction } from '../redux/cartSlice.js'

function ProductCard({ product }) {
    const dispatch = useDispatch()
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            
            {/* Ảnh sản phẩm (Thêm hiệu ứng zoom khi hover) */}
            <Link to={`/product/${product.id}`} className="overflow-hidden group block">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
            </Link>
            
            {/* Thông tin chi tiết */}
            <div className="p-5 flex flex-col flex-grow">
                
                <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors" title={product.name}>
                        {product.name}
                    </h3>
                </Link>
                
                {/* Mô tả: Ép cứng tối đa 2 dòng, tự động đẩy các thành phần dưới xuống đáy nhờ flex-grow */}
                <p className="text-gray-500 mt-2 text-sm line-clamp-2 flex-grow">
                    {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                    {/* Giá tiền: Làm nổi bật bằng màu đỏ và in đậm */}
                    <span className="font-bold text-lg text-red-500">
                        {product.price.toLocaleString('vi-VN')} đ
                    </span>

                    <button 
                        className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors active:scale-95"
                        onClick={() => dispatch(addToCartAction(product))}
                    >
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
            
        </div>
    )
}

export default ProductCard