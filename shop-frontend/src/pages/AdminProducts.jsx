import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../utils/axiosConfig.js'

function AdminProducts () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Thêm State cho Tìm kiếm và Phân trang
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Hàm gọi API dùng chung
  const fetchProducts = (page = 1, searchKeyword = '') => {
    setLoading(true);
    // Truyền params lên API (Giả sử 1 trang hiển thị 10 sản phẩm)
    axiosInstance.get(`/api/products?page=${page}&limit=7&keyword=${searchKeyword}`)
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.pagination.totalPages);
        setCurrentPage(res.data.pagination.currentPage);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải sản phẩm:', err);
        setLoading(false);
      });
  };

  // Vừa vào trang là tự động lấy dữ liệu trang 1
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(1, '');
  }, []);

  // Xử lý khi bấm nút Tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, keyword); // Tìm kiếm mới thì ép về trang 1
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage, keyword); // Chuyển trang nhưng vẫn giữ nguyên từ khóa tìm kiếm
    }
  };

  // Hàm xử lý xóa
  const handleDelete = (id, name) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không?`);
    if (isConfirm) {
      axiosInstance.delete(`/api/products/${id}`) //Dùng axiosInstance
        .then(() => {
          alert('✅ Đã xóa sản phẩm thành công!');
          // Xóa xong thì gọi lại API trang hiện tại để cập nhật danh sách
          fetchProducts(currentPage, keyword);
        })
        .catch((error) => {
          console.error('Lỗi xóa sản phẩm:', error);
          alert('❌ Có lỗi xảy ra khi xóa!');
        });
    }
  };

  return (
    <main className="max-w-full mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Sản Phẩm</h2>
          <Link to="/admin/orders" className="text-blue-600 text-sm font-semibold hover:underline">
             Đi tới Quản lý Đơn hàng &rarr;
          </Link>
        </div>

        {/* 👉 Khu vực Tìm kiếm và Thêm mới */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2.5 rounded-r-lg hover:bg-gray-900 text-sm font-medium">
              Tìm
            </button>
          </form>

          <Link 
            to="/admin/products/new" 
            className="bg-green-600 whitespace-nowrap text-white px-5 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
          >
            + Thêm Mới
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
              <th className="p-4 rounded-tl-lg w-16">ID</th>
              <th className="p-4 w-24">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Danh mục</th> 
              <th className="p-4">Giá bán</th>
              <th className="p-4 text-center">Kho</th>
              <th className="p-4 rounded-tr-lg text-center w-40">Hành động</th>
            </tr>
          </thead>
          
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">Chưa có sản phẩm nào.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-600">#{product.id}</td>
                  <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border shadow-sm" />
                  </td>
                  <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                  {/* 👉 Hiển thị tên danh mục thay vì ID */}
                  <td className="p-4 text-gray-600 text-sm">
                    {product.category?.name || '---'}
                  </td>
                  <td className="p-4 text-blue-600 font-bold">
                    {product.price.toLocaleString('vi-VN')} đ
                  </td>
                  {/* 👉 Hiển thị cảnh báo màu đỏ nếu hết hàng */}
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2 mt-2">
                    <Link 
                      to={`/admin/products/edit/${product.id}`}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                    >
                      Sửa
                    </Link>
                    <button 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
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

      {/* 👉 Khu vực Phân trang (Pagination) */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Trang <span className="font-bold text-gray-800">{currentPage}</span> / {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Trang trước
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminProducts