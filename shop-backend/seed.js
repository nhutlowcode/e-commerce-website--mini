// 

// =====================================================================

import prisma from './src/config/db.js';
import bcrypt from 'bcryptjs';


async function main() {
    console.log("🌱 Đang gieo mầm dữ liệu (Seeding)...");

    // Phải băm mật khẩu ra, nếu không lát nữa đem đi Test API Đăng nhập sẽ bị lỗi sai pass
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 1. Bơm tài khoản Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@.com' },
        update: {},
        create: {
            email: 'admin@.com',
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN',
        },
    });

    // 2. Bơm tài khoản User của bạn
    const user = await prisma.user.upsert({
        where: { email: 'minhnhutst365@gmail.com' },
        update: {},
        create: {
            email: 'minhnhutst365@gmail.com',
            password: hashedPassword,
            name: 'Minh Nhựt',
            role: 'USER',
        },
    });

    console.log("✅ Đã tạo xong 2 tài khoản mẫu với mật khẩu mặc định là: 123456");
    console.log(`- Admin: ${admin.email}`);
    console.log(`- User: ${user.email}`);
}

main()
    .catch((e) => {
        console.error("❌ Lỗi Seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        // Xong việc thì ngắt kết nối DB cho an toàn
        await prisma.$disconnect();
    });