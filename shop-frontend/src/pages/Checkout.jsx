import { useState } from 'react' 
import { useSelector, useDispatch } from 'react-redux' 
import { useNavigate } from 'react-router-dom' 
import axiosInstance from '../utils/axiosConfig.js' 
import { clearCart } from '../redux/cartSlice.js'  // Nhớ import hàm xóa sạch giỏ hàng khi đặt xong

function Checkout() {
    const cartItems = useSelector((state) => state.cart.cartItems || []) 
    const dispatch = useDispatch() 
    const navigate = useNavigate() 

    // 1. Quản lý thông tin giao hàng và Phương thức thanh toán
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        phone: '',
        address: ''
    }) 
    const [paymentMethod, setPaymentMethod] = useState('COD')  // Mặc định là COD (Tiền mặt)
    const [isSubmitting, setIsSubmitting] = useState(false) 

    // Tính tổng tiền tạm tính hiển thị trên giao diện
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) 

    const handleInputChange = (e) => {
        const { name, value } = e.target 
        setShippingInfo(prev => ({ ...prev, [name]: value })) 
    } 

    // 2. LOGIC LUỒNG XỬ LÝ ĐẶT HÀNG
    const handlePlaceOrder = async (e) => {
        e.preventDefault() 
        if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
            alert('Vui lòng điền đầy đủ thông tin giao hàng!') 
            return 
        }

        setIsSubmitting(true) 
        try {
            // Gửi toàn bộ dữ liệu đơn hàng kèm theo paymentMethod xuống Backend
            const response = await axiosInstance.post('/api/orders', {
                ...shippingInfo,
                paymentMethod,
                cartItems: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
            }) 

            const { paymentMethod: resMethod, paymentUrl } = response.data // , orderId

            // RẼ NHÁNH XỬ LÝ DỰA TRÊN KẾT QUẢ BACKEND TRẢ VỀ
            if (resMethod === 'ZALOPAY' && paymentUrl) {
                // TÌNH HUỐNG 1: Thanh toán Online. 
                // Bế thốc người dùng bay thẳng sang trang quét mã của ZaloPay
                window.location.href = paymentUrl 
            } else {
                // TÌNH HUỐNG 2: Thanh toán COD thành công
                dispatch(clearCart())  // Xóa sạch giỏ hàng trong Redux & LocalStorage
                alert('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.') 
                navigate('/order-history')  // Đẩy về trang Lịch sử đơn hàng để xem trạng thái
            }

        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error) 
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!') 
        } finally {
            setIsSubmitting(false) 
        }
    } 

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-20 font-medium text-gray-500">
                Giỏ hàng của bạn đang trống, không có gì để thanh toán cả!
            </div>
        ) 
    }

    return (
        <main className="max-w-5xl mx-auto p-6 mt-12 grow w-full grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cột trái: Form thông tin nhận hàng & Chọn phương thức */}
            <form onSubmit={handlePlaceOrder} className="md:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Thông tin giao hàng</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Họ và tên người nhận</label>
                        <input type="text" name="name" required value={shippingInfo.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ví dụ: Bùi Minh Nhựt" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                            <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Ví dụ: 0378xxxxxx" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ nhận hàng</label>
                            <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="Số nhà, tên đường, phường/xã..." />
                        </div>
                    </div>
                </div>

                {/* KHÚC GIAO DIỆN CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Phương thức thanh toán</h3>
                    <div className="space-y-3">
                        {/* Option 1: COD */}
                        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Trả tiền mặt trực tiếp cho shipper khi nhận được đồ</p>
                                </div>
                            </div>
                        </label>

                        {/* Option 2: ZALOPAY */}
                        <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'ZALOPAY' ? 'border-blue-600 bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <input type="radio" name="payment" value="ZALOPAY" checked={paymentMethod === 'ZALOPAY'} onChange={() => setPaymentMethod('ZALOPAY')} className="w-4 h-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Ví điện tử ZaloPay (Sandbox)</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Quét mã QR để thanh toán trực tuyến an toàn, bảo mật</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md border border-teal-200">Khuyên dùng</span>
                        </label>
                    </div>
                </div>
            </form>

            {/* Cột phải: Tóm tắt đơn hàng & Nút kích hoạt chốt đơn */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Tóm tắt đơn hàng</h3>
                <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 truncate max-w-45">{item.name} <span className="text-gray-400 font-mono text-xs">x{item.quantity}</span></span>
                            <span className="font-semibold text-gray-700">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center font-bold text-gray-800">
                    <span>Tổng cộng:</span>
                    <span className="text-xl text-red-500">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                <button type="button" onClick={handlePlaceOrder} disabled={isSubmitting} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:scale-100 flex justify-center items-center text-base">
                    {isSubmitting ? 'Đang xử lý hệ thống...' : (paymentMethod === 'ZALOPAY' ? 'Tiến hành quét mã QR' : 'Xác nhận đặt hàng')}
                </button>
            </div>
        </main>
    ) 
}

export default Checkout 