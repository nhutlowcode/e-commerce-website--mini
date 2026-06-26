import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosConfig.js'

function AddProduct() {
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: ''
    })

    useEffect(() => {
        axiosInstance.get('/api/category')
            .then((res) => {
                setCategories(res.data)
                if (res.data.length > 0) {
                    setFormData(prev => ({...prev, categoryId: res.data[0].id}))
                }
            })
            .catch(err => console.error("Lỗi tải danh mục:", err))

    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target // lấy ra 2 field từ sự kiện đang thao tác
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
        if (!imageFile) {
            return alert('Vui lòng thêm hình ảnh sản phẩm')
        }

        const data = new FormData()
        data.append('name', formData.name)
        data.append('price', formData.price)
        data.append('description', formData.description)
        data.append('stock', formData.stock) // Gửi thêm stock
        data.append('categoryId', formData.categoryId) //  Gửi thêm categoryId
        data.append('image', imageFile) // chữ image phải khớp với 'mật khẩu image' bên uploadMiddleware

        try {
            await axiosInstance.post('/api/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            alert('🎉 Đã thêm sản phẩm thành công')
            navigate('/admin/products')
        } catch (error) {
            console.error('Lỗi:', error);
            alert('❌ Có lỗi xảy ra khi thêm sản phẩm!')
        }
    }


  return (
    <main className='max-w-2xl mx-auto p-6 mt-12 mb-20 bg-white rounded-xl shadow-sm border border-gray-100'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>Thêm sản phẩm mới</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/* ... Các input name, price giữ nguyên ... */}
            <div>
                <label className='block text-gray-700 font-medium mb-2'>Tên sản phẩm</label>
                <input type="text" name='name' value={formData.name} onChange={handleChange} required className='w-full px-4 py-3 border border-gray-300 rounded-lg' />
            </div>
            
            {/* Ô chọn Danh mục */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Danh mục sản phẩm</label>
                <select 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Ô nhập Số lượng Tồn kho */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Số lượng Tồn kho</label>
                <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    min={0} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg" 
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Giá bán (VNĐ)</label>
                <input type="number" name="price" value={formData.price} min={0} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            </div>

            {/* 👉 THAY ĐỔI: Chuyển thành type="file" */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">Hình ảnh sản phẩm</label>
                <input 
                    type="file" 
                    accept="image/*" // Chỉ cho phép chọn file ảnh
                    onChange={handleImageChange}
                    required // Bắt buộc phải có ảnh khi tạo mới
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {/* Khu vực hiển thị ảnh xem trước */}
                {preview && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-2">Xem trước:</p>
                        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                    </div>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Mô tả sản phẩm</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
            </div>

            <button type="submit" className="bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors mt-4">
                Lưu Sản Phẩm
            </button>
        </form>
    </main>
  )
}

export default AddProduct