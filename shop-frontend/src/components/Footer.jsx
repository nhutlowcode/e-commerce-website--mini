function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột 1: Thông tin cửa hàng */}
        <div>
          <div className="text-2xl font-bold text-white mb-4">
            MinhNhut<span className="text-blue-500">Shop</span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            Mang đến cho bạn những xu hướng thời trang mới nhất với chất lượng và giá cả tốt nhất. Tự tin thể hiện phong cách của riêng bạn.
          </p>
        </div>

        {/* Cột 2: Đường dẫn nhanh */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Khám phá</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Trang chủ</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Sản phẩm mới</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Khuyến mãi mùa hè</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors">Bài viết / Blog</a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Liên hệ với chúng tôi</h3>
          <ul className="space-y-2 text-gray-400">
            <li>📍 Địa chỉ: 123 Đường Lập Trình, Quận Code, TP. Dev</li>
            <li>📞 Điện thoại: 0123 456 789</li>
            <li>✉️ Email: lienhe@minhnhutshop.com</li>
          </ul>
        </div>

      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Minh Nhựt Shop. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}

export default Footer;