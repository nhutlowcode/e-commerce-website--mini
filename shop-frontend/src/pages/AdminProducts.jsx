import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function AdminProducts () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API lấy danh sách sản phẩm khi vào trang
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => console.log('Lỗi:', err));
  }, []);

  // Hàm xử lý khi bấm nút Xóa
  const handleDelete = (id, name) => {
    // Hiển thị hộp thoại xác nhận để tránh xóa nhầm
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`);
    
    if (isConfirm) {
      // Gọi API Xóa của Backend
      axios.delete(`http://localhost:5000/api/products/${id}`)
        .then(() => {
          // Xóa thành công thì lọc sản phẩm đó ra khỏi danh sách hiện tại trên màn hình
          setProducts(products.filter((product) => product.id !== id));
          alert('✅ Đã xóa sản phẩm thành công!');
        })
        .catch((error) => {
          console.error('Lỗi xóa sản phẩm:', error);
          alert('❌ Có lỗi xảy ra khi xóa!');
        });
    }
  };

  if (loading) return <div className="text-center mt-20">Đang tải dữ liệu quản trị...</div>;

  return (
    <main className="max-w-6xl mx-auto p-6 mt-12 mb-20 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <h2 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h2>
          {/* 👉 Thêm nút nhảy sang trang Đơn hàng */}
          <Link to="/admin/orders" className="text-blue-600 font-semibold hover:underline">
              Đi tới Quản lý Đơn hàng &rarr;
          </Link>
      </div>
        <Link 
          to="/admin/products/new" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          + Thêm Mới
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 rounded-tl-lg">ID</th>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4 rounded-tr-lg text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600">#{product.id}</td>
                <td className="p-4">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md border" />
                </td>
                <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                <td className="p-4 text-blue-600 font-medium">
                  {product.price.toLocaleString('vi-VN')} đ
                </td>
                <td className="p-4 flex justify-center gap-3 mt-3">
                  <Link 
                    to={`/admin/products/edit/${product.id}`}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Sửa
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id, product.name)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Chưa có sản phẩm nào trong kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminProducts