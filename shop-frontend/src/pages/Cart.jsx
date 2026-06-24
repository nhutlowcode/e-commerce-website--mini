import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromCartAction, updateQuantityAction } from '../redux/cartSlice.js'

function Cart() {

    const cartItems = useSelector((state) => state.cart.cartItems || [])
    const dispatch = useDispatch()

    const totalPrice = cartItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const totalItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0)

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(updateQuantityAction({id: item.id, quantity: item.quantity - 1 }))
        } else {
            dispatch(removeFromCartAction(item.id))
        }
    }

    const handleIncrease = (item) => {
        dispatch(updateQuantityAction({ id: item.id, quantity: item.quantity + 1 }))
    }

  return (
    <main className='max-w-4xl mx-auto p-6 mt-12 grow text-center'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Giỏ hàng của bạn</h2>
        {/* Kiểm tra giỏ hàng trốngthifd hiển thị thông báo  */}
        {cartItems.length === 0 ? 
        (
            <div className='bg-white p-12 rounded-xl shadow-md text-center'>
                <p className='text-gray-500 text-lg mb-6'>Giỏ hàng hiện tại đang trống</p>
                {/* Thẻ link dùng để quay lại trang chủ mà không bị load lại trang */}
                <Link
                    to='/'
                    className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block'
                >
                    Quay lại mua sắm
                </Link>
            </div>
        ) :
        (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
            <div className='p-6'>
                {/* Lặp qua mảng để in ra từng dòng sản phẩm */}
                {cartItems.map((item, index) => (
                    <div key={index} className='flex items-center justify-between border-b border-gray-100 py-4 last:border-b-0'>
                        {/* hình ảnh và tên */}
                        <div className='flex items-center gap-4 w-full sm:w-2/5'>
                            <img src={item.image} alt={item.name} className='w-20 h-20 object-cover rounded-lg border border-b-gray-200' />
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800'>{item.name}</h3>
                                <p className='text-blue-600 font-medium'>{item.price.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>

                        {/* Bộ điều khiến số lượng */}
                        <div className='flex items-center gap-3 bg-gray-100 rounded-lg p-1'>
                            <button
                                onClick={() => handleDecrease(item)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition"
                            >
                                -
                            </button>
                            <span className='w-8 text-center font-semibold text-gray-800'>{item.quantity}</span>
                            <button
                                onClick={() => handleIncrease(item)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded shadow text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition"
                            >
                                +
                            </button>
                        </div>

                        
                        {/* Tổng tiền của món đó và Nút Xóa */}
                        <div className="flex items-center justify-between w-full sm:w-1/4">
                            {/* Tổng tiền */}
                            <span className="font-bold text-gray-800 text-lg">
                                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                            </span>
                            
                            {/* nút xóa */}
                            <button 
                                onClick={() => dispatch(removeFromCartAction(item.id))}
                                className="text-red-400 hover:text-red-600 p-2 transition-colors"
                                title="Xóa khỏi giỏ hàng"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Phần thanh toán */}
            <div className='bg-gray-50 p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4'>
                <div className='text-lg text-gray-600'>
                    Tổng số lượng: <span className='font-bold text-gray-800'>{totalItems} món</span>
                </div>

                <div className='flex items-center gap-6'>
                    <span className='text-xl font-bold text-gray-800'>Tổng cộng: </span>
                    <span className='text-3xl font-bold text-red-500'>
                        {totalPrice.toLocaleString('vi-VN')} đ
                    </span>
                </div>
            </div>

            <div className='p-6 pt-0 text-right bg-gray-50'>
                <Link 
                    to='/checkout'
                    className='w-full md:w-auto bg-green-500 text-white px-10 py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors shadow-md hover:shadow-lg inline-block text-center'
                >
                    Tiến hành đặt hàng
                </Link>
            </div>
        </div>
        )}
    </main>
  )
}

export default Cart