import { useState, useEffect } from 'react' 
import axiosInstance from '../utils/axiosConfig.js' 
import OrderDetailsModal from '../components/OrderDetailsModal.jsx'

function OrderHistory() {
    const [orders, setOrders] = useState([]) 
    const [isLoading, setIsLoading] = useState(true) 
    
    // Quản lý đóng mở modal y chang bên trang Admin
    const [selectedOrder, setSelectedOrder] = useState(null) 
    const [isModalOpen, setIsModalOpen] = useState(false) 

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const response = await axiosInstance.get('/api/orders/my-orders') 
                setOrders(response.data) 
            } catch (error) {
                console.error("Lỗi lấy lịch sử đơn hàng:", error) 
            } finally {
                setIsLoading(false) 
            }
        } 
        fetchMyOrders() 
    }, []) 

    const getStatusTextAndColor = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ xử lý', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' } 
            case 'PAID': return { text: 'Đã thanh toán', color: 'text-blue-600 bg-blue-50 border-blue-200' } 
            case 'SHIPPING': return { text: 'Đang giao hàng', color: 'text-purple-600 bg-purple-50 border-purple-200' } 
            case 'DELIVERED': return { text: 'Đã giao thành công', color: 'text-green-600 bg-green-50 border-green-200' } 
            case 'CANCELLED': return { text: 'Đã hủy đơn', color: 'text-red-600 bg-red-50 border-red-200' } 
            default: return { text: status, color: 'text-gray-600 bg-gray-50 border-gray-200' } 
        }
    } 

    if (isLoading) return <div className="text-center mt-20 font-semibold">Đang tải lịch sử mua hàng...</div> 

    return (
        <main className="max-w-4xl mx-auto p-6 mt-12 grow min-h-140">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử mua hàng</h2>

            {orders.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center border m">
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-150 overflow-y-auto pr-2">
                    {orders.map((order) => {
                        const statusInfo = getStatusTextAndColor(order.status) 
                        return (
                            <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm font-bold text-gray-700">#{order.id.substring(0, 8)}</span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                            {statusInfo.text}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-sm font-medium text-gray-600 mt-2">
                                        Tổng tiền: <span className="text-red-500 font-bold">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                                    </p>
                                </div>
                                
                                {/* Nút kích hoạt mở Modal xem chi tiết */}
                                <button
                                    onClick={() => {
                                        setSelectedOrder(order) 
                                        setIsModalOpen(true) 
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg text-sm hover:bg-blue-50 active:scale-95 transition-all"
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        ) 
                    })}
                </div>
            )}

            {/* BUM! GỌI LẠI COMPONENT CŨ VỚI DỮ LIỆU MỚI, KHÔNG TỐN 1 DÒNG HTML CODE LẠI */}
            <OrderDetailsModal 
                isOpen={isModalOpen} 
                isClose={() => {
                    setIsModalOpen(false) 
                    setSelectedOrder(null) 
                }} 
                order={selectedOrder} 
            />
        </main>
    ) 
}

export default OrderHistory 