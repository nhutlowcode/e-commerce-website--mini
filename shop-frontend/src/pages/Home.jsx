import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosConfig.js'
import Banner from '../components/Banner'
import ProductCard from '../components/ProductCard'

function Home() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    axiosInstance.get('/api/products')
      .then((res) => {
        const allProducts = res.data

        // lấy 4 sản phẩm đầu tiên
        const featureProducts = allProducts.slice(0, 4)
        setProducts(featureProducts)
      })
      .catch((err) => {
        console.log('Lỗi khi gọi API: ', err)
      })
  }, [])

  return (
    <>
        {/* Banner quảng cáo */}
      <Banner />

        {/* Phần nội dung của sản phẩm */}
      <main className="max-w-7xl mx-auto p-6 mt-12">
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Sản phẩm nổi bật
          </h2>
          <p className='text-gray-500 mt-2'>
            Cùng xem qua các sản phẩm nổi bật tại cửa hàng nhé!!
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              />
          ))}
        </div>
      </main>
    </>
  )
}

export default Home