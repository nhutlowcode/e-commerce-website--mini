import 'dotenv/config'; 
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import pkg from '@prisma/client';

// 1. Cấu hình kết nối giống hệt server.js
const { PrismaClient } = pkg;
const { Pool } = pg; 

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 2. Chuẩn bị một mảng chứa các sản phẩm mẫu
const mockProducts = [
    {
        name: "Áo Thun Cổ Tròn Basic",
        description: "Áo thun 100% cotton thoáng mát, thấm hút mồ hôi tốt.",
        price: 150000,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Ao+Thun" // Đã đổi link ảnh ổn định
    },
    {
        name: "Quần Jean Nam Ống Suông",
        description: "Quần jean chất liệu denim dày dặn, form chuẩn.",
        price: 350000,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Quan+Jean" // Đã đổi link ảnh ổn định
    },
    {
        name: "Balo Thời Trang Hàn Quốc",
        description: "Balo chống nước nhẹ, nhiều ngăn tiện dụng cho dân văn phòng và sinh viên.",
        price: 420000,
        image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Balo" // Đã đổi link ảnh ổn định
    }
];

// 3. Hàm chạy kịch bản tự động
async function main() {
    console.log("⏳ Bắt đầu dọn dẹp và nạp dữ liệu...");

    // Tùy chọn: Xóa hết dữ liệu cũ trong bảng Product để nạp mới (tránh bị rác)
    await prisma.product.deleteMany();
    console.log("🧹 Đã xóa sạch dữ liệu cũ!");

    // Duyệt qua mảng và dùng hàm create() để tạo từng sản phẩm trong Postgres
    for (const item of mockProducts) {
        await prisma.product.create({
            data: item
        });
    }
    
    console.log("✅ Đã nạp thành công 3 sản phẩm mẫu vào Database!");
}

// Kích hoạt hàm main và đóng kết nối khi hoàn thành
main()
    .catch((error) => {
        console.error("❌ Có lỗi xảy ra khi nạp dữ liệu:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });