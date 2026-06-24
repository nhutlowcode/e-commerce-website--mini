import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig.js'
import { io } from 'socket.io-client'
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        statBreakdown: [],
        monthlyRevenue: []
    }) 
    const [isLoading, setIsLoading] = useState(true) 

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Nhớ đổi link API nếu bro cấu hình khác
                const response = await axiosInstance.get('/api/orders/dashboard-stats') 
                setStats(response.data) 
            } catch (error) {
                console.error("Lỗi lấy dữ liệu Dashboard:", error) 
            } finally {
                setIsLoading(false) 
            }
        } 
        fetchStats() 
    }, []) 

    useEffect(() => {
        // khởi tạo kết nối tới server BE
        const socket = io('http://localhost:5000')

        // sau khi kết nối thành công thì xin vào phòng của admin
        socket.on('connect', () => {
            socket.emit('join_admin_room')
        })

        // phải đúng tên sự kiện là 'NEW_ORDER_CREATED'
        socket.on('NEW_ORDER_CREATED', (data) => {
            // 👉 FIX 1: Đổi /n thành \n và subString thành substring
            alert(`🔔 ${data.message} \n Mã đơn: ${data.orderId.substring(0, 8)}... \n Số tiền: +${data.totalAmount.toLocaleString('vi-VN')}đ`)

            // tiến hành cập nhật lại statae trực tiếp để vẽ lại UI
            setStats((preStats) => {
                const currentMonth = new Date().getMonth() + 1
                let updatedMonthlyRevenue = [...preStats.monthlyRevenue]
                const monthIndex = updatedMonthlyRevenue.findIndex(item => item.month === currentMonth)

                if (monthIndex >= 0) {
                    updatedMonthlyRevenue[monthIndex] = {
                        ...updatedMonthlyRevenue[monthIndex],
                        revenue: updatedMonthlyRevenue[monthIndex].revenue + data.totalAmount
                    }
                } else {
                    updatedMonthlyRevenue.push({ month: currentMonth, revenue: data.totalAmount})
                }
                
                return {
                    ...preStats,
                    totalRevenue: preStats.totalRevenue + data.totalAmount,
                    totalOrders: preStats.totalOrders + 1,
                    monthlyRevenue: updatedMonthlyRevenue
                }
            })
        }) // 👉 FIX 2: Đóng ngoặc socket.on ở đây!

        // 👉 FIX 3: Hàm dọn rác phải nằm ngang hàng với socket.on (nằm trực tiếp trong useEffect)
        return () => {
            socket.off('NEW_ORDER_CREATED')
            socket.disconnect()
        }
    }, []) // 👉 FIX 4: Mảng rỗng của useEffect nằm ở tuốt dưới cùng này!
        

    // Format lại dữ liệu tháng cho biểu đồ hiển thị đẹp hơn (VD: "Tháng 6")
    const chartData = stats.monthlyRevenue.map(item => ({
        name: `Tháng ${item.month}`,
        doanhThu: item.revenue
    })) 

    if (isLoading) return <div className="text-center mt-20">Đang tải dữ liệu...</div> 

    return (
        <main className="max-w-7xl mx-auto p-6 mt-8 grow w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Tổng quan kinh doanh</h2>

            {/* Hàng 1: Các thẻ chỉ số tổng quan (Metrics Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium mb-2">Tổng doanh thu thực tế</p>
                    <p className="text-3xl font-black text-red-500">
                        {stats.totalRevenue.toLocaleString('vi-VN')} đ
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium mb-2">Tổng đơn hàng thành công</p>
                    <p className="text-3xl font-black text-blue-600">
                        {stats.totalOrders} <span className="text-lg font-medium text-gray-400">đơn</span>
                    </p>
                </div>
            </div>

            {/* Hàng 2: Biểu đồ */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Doanh thu theo tháng</h3>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tickFormatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                            />
                            <Tooltip 
                                formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']}
                                cursor={{ fill: '#F3F4F6' }}
                            />
                            <Bar dataKey="doanhThu" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </main>
    ) 
}

export default AdminDashboard 