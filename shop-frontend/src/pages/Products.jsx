import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig.js' 
import ProductCard from '../components/ProductCard' 

function Products({ handleAddtoCart }) {
  const [products, setProducts] = useState([]) 
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // state cho tim kiếm và lock
  const [keyword, setKeyword] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')


  const fetchProducts = (searchParams = {}) => {
    setLoading(true)
    
    // dùng cái URLSearchParams để tự động nối chuỗi
    const query = new URLSearchParams(searchParams).toString()
    const url = query ? `/api/products?${query}` : '/api/products'

    axiosInstance.get(url)
    .then(res => {
      setProducts(res.data.products)
      setTotalPages(res.data.pagination.totalPages)
      setCurrentPage(res.data.pagination.currentPage)
      setLoading(false)
    })
    .catch(err => {
      console.log('lỗi khi gọi api lấy sản phẩm', err)
      setLoading(false)
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [])

  const handleFilterSubmit = (e) => {
    e.preventDefault()

    const params = { page: 1 }
    if (keyword) params.keyword = keyword
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    fetchProducts(params)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = { page: newPage };
    if (keyword) params.keyword = keyword;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    fetchProducts(params);
  }

  const handleClearFilter = () => {
    setKeyword('')
    setMinPrice('')
    setMaxPrice('')
    fetchProducts({})
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-8 flex flex-col md:flex-row gap-8">
      
      {/* Cột trái: Khu vực Sidebar Bộ lọc */}
            <aside className="w-full md:w-1/4">
                <div className="sticky top-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Bộ lọc sản phẩm</h2>
                    
                    <form onSubmit={handleFilterSubmit} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                        
                        {/* Nhập từ khóa tìm kiếm */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm tên</label>
                            <input 
                                type="text" 
                                placeholder="VD: Bàn phím, Balo..." 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Lọc theo khoảng giá */}
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Khoảng giá (VNĐ)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Từ"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-1/2 border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number" 
                                    placeholder="Đến" 
                                    value={maxPrice}
                                    min={minPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-1/2 border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Cụm nút hành động */}
                        <div className="flex flex-col gap-3">
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Áp dụng bộ lọc
                            </button>
                            <button 
                                type="button" 
                                onClick={handleClearFilter}
                                className="w-full bg-gray-100 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Làm mới
                            </button>
                        </div>

                    </form>
                </div>
            </aside>

      {/* Cột phải: Danh sách toàn bộ sản phẩm */}
      <main className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Tất cả sản phẩm</h2>
            <span className="text-gray-500 text-sm">Hiển thị {products.length} kết quả</span>
        </div>
        
        {loading ? (
            <div className="text-center py-10 text-gray-500 font-medium">Đang tải danh sách sản phẩm...</div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAddToCart={handleAddtoCart}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">
                        Không tìm thấy sản phẩm nào.
                    </p>
                )}
            </div>  
        )}
        {/* 👉 Khu vực Phân trang */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Trang trước
                    </button>
                    
                    <span className="text-gray-700 font-medium px-4">
                        {currentPage} / {totalPages}
                    </span>

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Trang sau
                    </button>
                </div>
            )}
      </main>

    </div>
  ) 
}

export default Products 