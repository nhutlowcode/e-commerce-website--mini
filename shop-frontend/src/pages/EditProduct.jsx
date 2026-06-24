import { useState, useEffect } from 'react' 
import { useNavigate, useParams } from 'react-router-dom' 
import axiosInstance from '../utils/axiosConfig.js'

function EditProduct() {
  const { id } = useParams()  // Lấy ID từ trên URL
  const navigate = useNavigate() 
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true) 

  // Vừa vào trang là phải lấy thông tin cũ điền vào form ngay
  useEffect(() => {
    axiosInstance.get(`/api/products/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price
        })
        setPreview(res.data.image)
        setLoading(false) 
      })
      .catch((err) => {
        console.error('Lỗi lấy thông tin sản phẩm:', err) 
        alert('Không tìm thấy sản phẩm cần sửa!') 
        navigate('/admin/products') 
      }) 
  }, [id, navigate]) 

  const handleChange = (e) => {
    const { name, value } = e.target 
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    })) 
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append('name', formData.name)
    data.append('price', formData.price)
    data.append('description', formData.description)

    // chỉ đính kèm ảnh khi có ảnh mới được chọn
    if (imageFile) {
      data.append('image', imageFile)
    }

    try {
       // Gọi API phương thức PUT để cập nhật
      await axiosInstance.put(`/api/products/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => {
          alert('🎉 Sửa sản phẩm thành công')
          navigate('/admin/products')
        })
    } catch (error) {
        console.error('Lỗi:', error);
        alert('❌ Có lỗi xảy ra khi thêm sản phẩm!')
    }
  } 

  if (loading) return <div className="text-center mt-20">Đang tải thông tin sản phẩm...</div> 

  return (
    <main className="max-w-2xl mx-auto p-6 mt-12 mb-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sửa Thông Tin Sản Phẩm</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tên sản phẩm</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Giá bán (VNĐ)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Thay đổi ảnh (Bỏ trống nếu giữ nguyên)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            // KHÔNG CÓ required Ở ĐÂY
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
          />
          {preview && (
            <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Ảnh hiện tại:</p>
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Mô tả sản phẩm</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
        </div>

        <button type="submit" className="bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors mt-4">
          Cập Nhật Sản Phẩm
        </button>
      </form>
    </main>
  )
}

export default EditProduct 