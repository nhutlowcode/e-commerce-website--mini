// 
import prisma from './src/config/db.js';

async function main() {
    console.log("🌱 Bắt đầu gieo mầm dữ liệu...");

    // ==========================================
    // BƯỚC 1: TẠO DANH MỤC TRƯỚC (NẾU CHƯA CÓ)
    // ==========================================
    console.log("📂 Đang khởi tạo các danh mục cốt lõi...");
    
    // Dùng upsert: Có rồi thì thôi, chưa có thì tạo mới
    const catAoNam = await prisma.category.upsert({ where: { name: "Áo Nam" }, update: {}, create: { name: "Áo Nam" } });
    const catQuanNam = await prisma.category.upsert({ where: { name: "Quần Nam" }, update: {}, create: { name: "Quần Nam" } });
    const catAoKhoac = await prisma.category.upsert({ where: { name: "Áo Khoác" }, update: {}, create: { name: "Áo Khoác" } });
    const catAoNu = await prisma.category.upsert({ where: { name: "Áo Nữ" }, update: {}, create: { name: "Áo Nữ" } });
    const catQuanNu = await prisma.category.upsert({ where: { name: "Quần Nữ" }, update: {}, create: { name: "Quần Nữ" } });
    const catVayNu = await prisma.category.upsert({ where: { name: "Váy Nữ" }, update: {}, create: { name: "Váy Nữ" } });

    // ==========================================
    // BƯỚC 2: TẠO SẢN PHẨM VÀ GẮN ID DANH MỤC VÀO
    // ==========================================
    console.log("👗 Đang bơm 20 sản phẩm quần áo vào kho...");

    // Lưu ý: Chữ 'category: "..."' đã được thay thế hoàn toàn bằng 'categoryId: biến.id'
    const outfitProducts = [
        { name: "Áo Thun Nam Cổ Tròn Basic", description: "Áo thun 100% cotton thoáng mát, thấm hút mồ hôi tốt.", price: 150000, stock: 50, image: "https://picsum.photos/400/500?random=1", categoryId: catAoNam.id },
        { name: "Áo Polo Nam Dáng Regular", description: "Áo Polo thanh lịch, phù hợp đi làm và đi chơi.", price: 250000, stock: 30, image: "https://picsum.photos/400/500?random=2", categoryId: catAoNam.id },
        { name: "Quần Jean Nam Ống Suông", description: "Chất denim cao cấp, không phai màu.", price: 350000, stock: 40, image: "https://picsum.photos/400/500?random=3", categoryId: catQuanNam.id },
        { name: "Quần Short Khaki Năng Động", description: "Quần short co giãn nhẹ, form dáng trẻ trung.", price: 180000, stock: 60, image: "https://picsum.photos/400/500?random=4", categoryId: catQuanNam.id },
        { name: "Áo Sơ Mi Trắng Dài Tay", description: "Sơ mi form chuẩn, chất liệu chống nhăn.", price: 280000, stock: 45, image: "https://picsum.photos/400/500?random=5", categoryId: catAoNam.id },
        { name: "Áo Khoác Bomber Nam", description: "Áo khoác dù lót gió, chống nước nhẹ.", price: 450000, stock: 20, image: "https://picsum.photos/400/500?random=6", categoryId: catAoKhoac.id },
        { name: "Áo Hoodie Nỉ Bông Dày Dặn", description: "Áo hoodie trơn màu, form unisex oversize.", price: 300000, stock: 35, image: "https://picsum.photos/400/500?random=7", categoryId: catAoKhoac.id },
        { name: "Quần Âu Nam Thanh Lịch", description: "Quần tây form slimfit, tôn dáng chuẩn.", price: 320000, stock: 25, image: "https://picsum.photos/400/500?random=8", categoryId: catQuanNam.id },
        { name: "Áo Thun Oversize Nữ", description: "Phong cách đường phố, chất vải mềm mịn.", price: 160000, stock: 55, image: "https://picsum.photos/400/500?random=9", categoryId: catAoNu.id },
        { name: "Chân Váy Chữ A Xếp Ly", description: "Chân váy caro trẻ trung, phong cách Hàn Quốc.", price: 200000, stock: 40, image: "https://picsum.photos/400/500?random=10", categoryId: catVayNu.id },
        { name: "Đầm Suông Mùa Hè", description: "Đầm hoa nhí vintage, nhẹ nhàng nữ tính.", price: 350000, stock: 15, image: "https://picsum.photos/400/500?random=11", categoryId: catVayNu.id },
        { name: "Quần Jean Nữ Lưng Cao", description: "Hack dáng cực đỉnh, chất bò co giãn.", price: 340000, stock: 30, image: "https://picsum.photos/400/500?random=12", categoryId: catQuanNu.id },
        { name: "Áo Khoác Cardigan Nữ", description: "Áo len mỏng dệt kim, giữ ấm mùa thu.", price: 270000, stock: 25, image: "https://picsum.photos/400/500?random=13", categoryId: catAoKhoac.id },
        { name: "Áo Trễ Vai Gợi Cảm", description: "Áo kiểu nữ điệu đà, phù hợp dạo phố.", price: 190000, stock: 45, image: "https://picsum.photos/400/500?random=14", categoryId: catAoNu.id },
        { name: "Quần Baggy Vải Mềm", description: "Che khuyết điểm chân, cực kỳ thoải mái.", price: 260000, stock: 35, image: "https://picsum.photos/400/500?random=15", categoryId: catQuanNu.id },
        { name: "Áo Sweater Nam Nữ", description: "Áo nỉ chui đầu, in họa tiết nổi bật.", price: 290000, stock: 50, image: "https://picsum.photos/400/500?random=16", categoryId: catAoKhoac.id },
        { name: "Quần Jogger Thể Thao", description: "Quần thun bo gấu, thích hợp vận động.", price: 220000, stock: 40, image: "https://picsum.photos/400/500?random=17", categoryId: catQuanNam.id },
        { name: "Áo Khoác Denim Cá Tính", description: "Áo bò unisex form rộng, mài rách nhẹ.", price: 480000, stock: 20, image: "https://picsum.photos/400/500?random=18", categoryId: catAoKhoac.id },
        { name: "Đầm Dạ Hội Dáng Dài", description: "Thiết kế xẻ tà sang trọng, dự tiệc cực xịn.", price: 850000, stock: 10, image: "https://picsum.photos/400/500?random=19", categoryId: catVayNu.id },
        { name: "Áo Gile Len Hàn Quốc", description: "Áo len không tay, phối layer cùng sơ mi.", price: 210000, stock: 30, image: "https://picsum.photos/400/500?random=20", categoryId: catAoNu.id }
    ];

    const createdProducts = await prisma.product.createMany({
        data: outfitProducts,
        skipDuplicates: true,
    });

    console.log(`✅ Đã thêm thành công ${createdProducts.count} sản phẩm!`);
}

main()
    .catch((e) => {
        console.error("❌ Lỗi Seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


// =====================================================================

// import prisma from './src/config/db.js';
// import bcrypt from 'bcryptjs';


// async function main() {
//     console.log("🌱 Đang gieo mầm dữ liệu (Seeding)...");

//     // Phải băm mật khẩu ra, nếu không lát nữa đem đi Test API Đăng nhập sẽ bị lỗi sai pass
//     const hashedPassword = await bcrypt.hash('123456', 10);

//     // 1. Bơm tài khoản Admin
//     const admin = await prisma.user.upsert({
//         where: { email: 'admin@.com' },
//         update: {},
//         create: {
//             email: 'admin@.com',
//             password: hashedPassword,
//             name: 'Admin',
//             role: 'ADMIN',
//         },
//     });

//     // 2. Bơm tài khoản User của bạn
//     const user = await prisma.user.upsert({
//         where: { email: 'minhnhutst365@gmail.com' },
//         update: {},
//         create: {
//             email: 'minhnhutst365@gmail.com',
//             password: hashedPassword,
//             name: 'Minh Nhựt',
//             role: 'USER',
//         },
//     });

//     console.log("✅ Đã tạo xong 2 tài khoản mẫu với mật khẩu mặc định là: 123456");
//     console.log(`- Admin: ${admin.email}`);
//     console.log(`- User: ${user.email}`);
// }

// main()
//     .catch((e) => {
//         console.error("❌ Lỗi Seeding:", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         // Xong việc thì ngắt kết nối DB cho an toàn
//         await prisma.$disconnect();
//     });