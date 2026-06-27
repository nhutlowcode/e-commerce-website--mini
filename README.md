# 🛒 E-Commerce Website (Mini-Project)

Dự án website thương mại điện tử hoàn chỉnh được xây dựng theo kiến trúc **SERN Stack**, áp dụng mô hình quản lý mã nguồn tập trung (Monorepo) và triển khai thực tế trên môi trường đám mây.

## 🌐 Đường dẫn thực tế (Live Demo)
- Frontend UI (Vercel): https://e-commerce-website-mini-yxhk.vercel.app
- Backend API (Render): https://e-commerce-website-mini.onrender.com

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### 🎨 Mặt trận Frontend
- Framework: React.js (đóng gói bằng Vite)
- Routing: React Router DOM (Single Page Application)
- HTTP Client: Axios (Cấu hình Interceptor tách biệt môi trường)
- Styling: Tailwind CSS / CSS Modules [Sửa lại theo thư viện bạn dùng]

### ⚙️ Mặt trận Backend & Database
- Runtime: Node.js & Express.js
- ORM: Prisma (Quản lý và đồng bộ Database Schema)
- Database: PostgreSQL (Lưu trữ và quản lý trên đám mây Supabase)
- Authentication: JSON Web Token (JWT) & BcryptJS (Mã hóa mật khẩu)

---

## 🏗️ Cấu trúc dự án (Project Architecture)

Dự án áp dụng cấu trúc "Monorepo" để quản lý đồng thời cả Frontend và Backend trong một kho chứa duy nhất:

```
e-commerce-website--mini/
├── shop-backend/          # Mã nguồn Server (Node/Express/Prisma)
│   ├── prisma/            # Schema và file Seed dữ liệu PostgreSQL
│   ├── src/               # Code logic xử lý API (Routes, Controllers, Config)
│   └── package.json
├── shop-frontend/         # Mã nguồn Giao diện (React/Vite)
│   ├── src/               # Components, Pages, Utils (Axios Config)
│   ├── vercel.json        # File cấu hình điều hướng tránh lỗi 404 khi F5
│   └── package.json
└── README.md              # Tài liệu hướng dẫn dự án
 ```
✨ Tính năng cốt lõi (Key Features)
- Xác thực & Phân quyền: Đăng ký, đăng nhập tài khoản. Phân quyền chặt chẽ giữa USER (Khách mua hàng) và ADMIN (Quản trị viên hệ thống).
- Quản lý danh mục & Sản phẩm: Toàn bộ dữ liệu được liên kết khóa ngoại chặt chẽ trong PostgreSQL, tối ưu hóa truy vấn thông qua Prisma ORM.
- Giỏ hàng toàn diện (Cart System): Lưu trữ giỏ hàng, tự động xử lý cộng dồn số lượng khi trùng mã sản phẩm nhờ ràng buộc độc bản @@unique.
- Hệ thống đơn hàng (Order Tracking): Quản lý luồng trạng thái đơn hàng phức tạp (PENDING, PAID, SHIPPING, DELIVERED, CANCELLED).
- Tự động hóa dữ liệu (Database Seeding): Tích hợp script khởi tạo tự động 20 sản phẩm mẫu và tài khoản hệ thống giúp dễ dàng kiểm thử.
