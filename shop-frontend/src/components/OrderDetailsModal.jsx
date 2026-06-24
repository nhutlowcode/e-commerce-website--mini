
function OrderDetailsModal({ isOpen, isClose, order }) {
  return (
    <>
        {/* BẮT ĐẦU HOẠT ẢNH MODAL LỒNG VÀO NỀN XÁM */}
        {isOpen && order && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative border border-gray-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                
                {/* Tiêu đề Modal & Nút đóng */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h3>
                        <p className="text-xs font-mono text-gray-400 mt-1">ID: {order.id}</p>
                    </div>
                    <button 
                        onClick={isClose}
                        className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors text-sm font-bold w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>

                {/* Thông tin giao hàng nhanh */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-6 text-sm">
                    <div>
                        <p className="text-gray-500 mb-1">Người nhận:</p>
                        <p className="font-semibold text-gray-800">{order.name} ({order.phone})</p>
                    </div>
                    <div>
                        <p className="text-gray-500 mb-1">Địa chỉ giao hàng:</p>
                        <p className="font-semibold text-gray-800 truncate" title={order.address}>{order.address}</p>
                    </div>
                </div>

                {/* Danh sách sản phẩm bên trong đơn hàng */}
                <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Danh sách mặt hàng</h4>
                <div className="divide-y border rounded-xl overflow-hidden bg-white mb-6 grow overflow-y-auto">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                {/* Ảnh sản phẩm nhỏ */}
                                <img 
                                    src={item.product?.image} 
                                    alt={item.product?.name} 
                                    className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                                />
                                <div>
                                    <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.product?.name}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Đơn giá lúc mua: <span className="font-semibold">{item.price.toLocaleString('vi-VN')}đ</span>
                                    </p>
                                </div>
                            </div>
                            {/* Số lượng và tổng tiền món đó */}
                            <div className="text-right">
                                <p className="text-sm font-bold text-blue-600">x{item.quantity}</p>
                                <p className="text-sm font-bold text-gray-900 mt-0.5">
                                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Khối tổng kết dòng tiền dưới cùng */}
                <div className="border-t pt-4 flex justify-between items-center mt-auto">
                    <span className="text-base font-bold text-gray-700">Tổng doanh thu đơn hàng:</span>
                    <span className="text-2xl font-black text-red-500">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                    </span>
                </div>

            </div>
        </div>
        )}
    </>
  )
}

export default OrderDetailsModal