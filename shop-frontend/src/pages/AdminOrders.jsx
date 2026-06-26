import { useState, useEffect } from 'react' 
import { Link } from 'react-router-dom' 
import axiosInstance from '../utils/axiosConfig.js'
import { DataGrid } from '@mui/x-data-grid'
import OrderDetailsModal from '../components/OrderDetailsModal.jsx'

function AdminOrders() {
    const [orders, setOrders] = useState([]) 
    const [isLoading, setIsLoading] = useState(true)

    const [rowCount, setRowCount] = useState(0)
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10
    })

    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchOrders = async () => {
        setIsLoading(true)
        try {
            // 👉 TÍNH TOÁN VÀ TRUYỀN PARAMS CHO CHUẨN XỊN:
            // DataGrid trang 0 -> Backend hiểu là trang 1
            const backendPage = paginationModel.page + 1;
            const backendLimit = paginationModel.pageSize;

            const response = await axiosInstance.get(
                `/api/orders/admin?page=${backendPage}&limit=${backendLimit}`
            ) 
            
            setOrders(response.data.orders) 
            setRowCount(response.data.pagination.totalOrders)
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error) 
            alert('Không thể tải danh sách đơn hàng!') 
        } finally {
            setIsLoading(false) 
        }
    } 

    // 👉 Đảm bảo useEffect lắng nghe sự thay đổi của cả trang và kích thước trang để re-fetch dữ liệu
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOrders() 
    }, [paginationModel.page, paginationModel.pageSize])

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/api/orders/admin/${orderId}`, { status: newStatus }) 
            
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            ) 
        } catch (error) {
            console.error("Lỗi cập nhật:", error) 
            alert('Có lỗi xảy ra khi cập nhật trạng thái.') 
        }
    } 

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800' 
            case 'PAID': return 'bg-blue-100 text-blue-800' 
            case 'SHIPPING': return 'bg-purple-100 text-purple-800' 
            case 'DELIVERED': return 'bg-green-100 text-green-800' 
            case 'CANCELLED': return 'bg-red-100 text-red-800' 
            default: return 'bg-gray-100 text-gray-800' 
        }
    }    

    const handleOpenDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    }

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    }

    // ĐỊNH NGHĨA CÁC CỘT CHO DATAGRID
    const columns = [
        { 
            field: 'id', 
            headerName: 'Mã Đơn', 
            width: 130, 
            renderCell: (params) => <span className="font-mono text-gray-500">{params.row.id.substring(0, 8)}...</span>
        },
        { 
            field: 'name', 
            headerName: 'Khách hàng', 
            width: 200,
            renderCell: (params) => (
                <div className="flex flex-col justify-center h-full">
                    <span className="font-semibold">{params.row.name}</span>
                    <span className="text-xs text-gray-500">{params.row.phone}</span>
                </div>
            )
        },
        { 
            field: 'createdAt', 
            headerName: 'Ngày đặt', 
            width: 150,
            // Đã thay thế valueGetter bằng renderCell
            renderCell: (params) => {
                if (!params.row.createdAt) return <span></span>;
                return <span>{new Date(params.row.createdAt).toLocaleDateString('vi-VN')}</span>;
            }
        },
        { 
            field: 'totalAmount', 
            headerName: 'Tổng tiền', 
            width: 150,
            renderCell: (params) => (
                <span className="font-bold text-red-500">{params.row.totalAmount.toLocaleString('vi-VN')} đ</span>
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: (params) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(params.row.status)}`}>
                    {params.row.status}
                </span>
            )
        },
        {
            field: 'viewDetails',
            headerName: 'Chi tiết',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <button
                    onClick={() => handleOpenDetails(params.row)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95 px-3 py-1.5 rounded-lg font-bold text-sm transition-all"
                >
                    Xem 👁️
                </button>
            )
        },
        {
            field: 'action',
            headerName: 'Cập nhật',
            width: 200,
            sortable: false, // Cột này không cần sort
            renderCell: (params) => (
                <select 
                    value={params.row.status}
                    onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                    className="border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                >
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PAID">Đã thanh toán</option>
                    <option value="SHIPPING">Đang giao hàng</option>
                    <option value="DELIVERED">Đã giao thành công</option>
                    <option value="CANCELLED">Hủy đơn</option>
                </select>
            )
        }
    ] 

     return (
        <main className='max-w-7xl mx-auto p-6 mt-8 grow'>
            <div className="flex justify-between items-center mb-8">
                <h2 className='text-3xl font-bold text-gray-800'>Quản trị Đơn hàng</h2>
                <Link to="/admin/products" className="text-blue-600 font-semibold hover:underline">
                    Đi tới Quản lý Sản phẩm
                </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4" style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    loading={isLoading}
                    pageSizeOptions={[5, 10, 25]}
                    // 👉 4. CẬP NHẬT CẤU HÌNH BẬT TÍNH NĂNG ĐIỀU KHIỂN TỪ XA
                    paginationMode="server" // Báo cho DataGrid biết là tao tự quản lý, mày đừng có tự phân trang nữa
                    rowCount={rowCount} // Bơm tổng số dòng vào đây
                    paginationModel={paginationModel} // Ràng buộc state hiện tại
                    onPaginationModelChange={setPaginationModel} // Hàm cập nhật state khi user bấm Next/Prev
                    disableRowSelectionOnClick
                    className="border-none"
                />
            </div>

            <OrderDetailsModal isOpen={isModalOpen} isClose={handleCloseDetails} order={selectedOrder}/>
        </main>
    )
}

export default AdminOrders 