import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const ClientLayout = () => {
  return (
    <>
      <Navbar />
      {/* Outlet chính là cái hố để React Router tự động nhét nội dung của từng trang (Home, Cart, Products...) vào đây */}
      <div className="min-h-[calc(100vh-200px)]"> 
        <Outlet /> 
      </div>
      <Footer />
    </>
  )
}

export default ClientLayout