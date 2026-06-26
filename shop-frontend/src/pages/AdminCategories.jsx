import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig.js'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State quản lý ô Input nhập tên danh mục
  const [categoryName, setCategoryName] = useState('')
  
  // State đặc biệt: Lưu danh mục đang được chọn để SỬA
  // Nếu bằng null -> Form đang ở chế độ THÊM MỚI
  // Nếu có object -> Form đang ở chế độ CẬP NHẬT
  const [editingCategory, setEditingCategory] = useState(null)

  // 1. Lấy danh sách danh mục từ Backend
  const fetchCategories = () => {
    setLoading(true)
    axiosInstance.get('/api/category') // Hãy check kỹ route BE của bạn là /api/category hay /api/categories
      .then(res => {
        setCategories(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi lấy danh mục:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [])

  // 2. Xử lý Submit Form (Hàm đa năng xử lý cả Thêm và Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return alert('Tên danh mục không được để trống')

    try {
      if (editingCategory) {
        // LUỒNG SỬA: Nếu đang có danh mục chờ sửa, bắn API PUT
        await axiosInstance.put(`/api/category/${editingCategory.id}`, { name: categoryName })
        alert('✅ Cập nhật danh mục thành công!')
      } else {
        // LUỒNG THÊM: Nếu không có danh mục nào chờ sửa, bắn API POST
        await axiosInstance.post('/api/category', { name: categoryName })
        alert('🎉 Thêm danh mục mới thành công!')
      }

      // Reset lại trạng thái Form về ban đầu
      setCategoryName('')
      setEditingCategory(null)
      fetchCategories() // Tải lại danh sách mới
    } catch (error) {
      console.error("Lỗi xử lý danh mục:", error)
      alert(error.response?.data?.message || '❌ Thao tác thất bại!')
    }
  }

  // 3. Xử lý khi Admin bấm nút "Sửa" trên một dòng
  const handleEditClick = (category) => {
    setEditingCategory(category) // Ghi nhận danh mục cần sửa
    setCategoryName(category.name) // Đẩy tên cũ vào ô Input để Admin sửa
  }

  // 4. Xử lý Xóa danh mục
  const handleDelete = (id, name) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"?\nLưu ý: Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng!`)
    if (isConfirm) {
      axiosInstance.delete(`/api/category/${id}`)
        .then(() => {
          alert('🗑️ Đã xóa danh mục thành công!')
          // Nếu đang sửa chính cái danh mục vừa bị xóa thì hủy chế độ sửa
          if (editingCategory?.id === id) {
            setEditingCategory(null)
            setCategoryName('')
          }
          fetchCategories()
        })
        .catch(error => {
          console.error("Lỗi xóa danh mục:", error)
          alert(error.response?.data?.message || '❌ Không thể xóa danh mục này!')
        })
    }
  }

  // Hàm hủy chế độ sửa, quay về chế độ thêm mới
  const handleCancelEdit = () => {
    setEditingCategory(null)
    setCategoryName('')
  }

  return (
    <main className="max-w-full mx-auto flex flex-col md:flex-row gap-8">
      
      {/* KHỐI BÊN TRÁI: FORM NHẬP LIỆU */}
      <div className="w-full md:w-1/5">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {editingCategory ? '📝 Sửa danh mục' : '✨ Thêm danh mục mới'}
          </h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tên danh mục</label>
              <input 
                type="text"
                placeholder="VD: Áo Sơ Mi, Quần Tây..."
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button 
                type="submit"
                className={`w-full text-white font-semibold py-3 rounded-lg transition-colors text-sm ${
                  editingCategory ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </button>

              {/* Nút hủy bỏ chế độ sửa (Chỉ hiện khi đang ở chế độ Sửa) */}
              {editingCategory && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full bg-gray-100 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Hủy bỏ
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* KHỐI BÊN PHẢI: BẢNG DANH SÁCH */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh Sách Danh Mục</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm font-semibold uppercase border-b border-gray-100">
                <th className="p-4 w-24">Mã ID</th>
                <th className="p-4">Tên danh mục</th>
                <th className="p-4 text-center w-44">Hành động</th>
              </tr>
            </thead>
            
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500 font-medium">Đang tải danh mục...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">Hệ thống chưa có danh mục nào.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-500">#{cat.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{cat.name}</td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => handleEditClick(cat)}
                        className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-md hover:bg-amber-500 hover:text-white transition-colors font-medium"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-600 hover:text-white transition-colors font-medium"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  )
}

export default AdminCategories