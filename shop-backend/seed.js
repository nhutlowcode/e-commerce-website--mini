import prisma from './src/config/db.js'

const sampleProducts = [
    {
        name: "Bàn phím cơ Logitech MX Mechanical",
        description: "Bàn phím cơ không dây cao cấp dành cho lập trình viên và dân văn phòng. Gõ siêu êm, pin dùng cả tháng.",
        price: 3500000,
        stock: 50,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"
    },
    {
        name: "Chuột không dây MX Master 3S",
        description: "Chuột làm việc đỉnh cao với cảm biến 8000 DPI, cuộn vô cực siêu nhanh, thiết kế công thái học chống mỏi tay.",
        price: 2600000,
        stock: 30,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"
    },
    {
        name: "Màn hình Dell UltraSharp 27 inch 4K",
        description: "Màn hình đồ họa chuyên nghiệp, độ phân giải 4K sắc nét, viền siêu mỏng hiển thị màu cực chuẩn.",
        price: 12500000,
        stock: 15,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
    },
    {
        name: "Áo thun Cotton nam Cổ tròn Basic",
        description: "Áo thun 100% cotton thoáng mát, thấm hút mồ hôi tốt, form chuẩn phù hợp mặc ở nhà lẫn đi chơi.",
        price: 150000,
        stock: 200,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80"
    },
    {
        name: "Giày Sneaker nam thời trang",
        description: "Giày thể thao trắng kinh điển, đế cao su nguyên khối êm ái, dễ phối đồ, phù hợp mọi phong cách.",
        price: 2500000,
        stock: 45,
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80"
    },
    {
        name: "Tai nghe Bluetooth Sony WH-1000XM5",
        description: "Tai nghe chụp tai chống ồn chủ động không dây tốt nhất hiện nay, pin 30 giờ, âm thanh Hi-Res chân thực.",
        price: 6500000,
        stock: 25,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80"
    },
    {
        name: "Balo Laptop đa năng chống nước",
        description: "Balo rộng rãi, có ngăn chống sốc laptop 15.6 inch, chất liệu vải dù cao cấp chống thấm nước tuyệt đối.",
        price: 450000,
        stock: 80,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
    },
    {
        name: "Đồng hồ thông minh sang trọng",
        description: "Đồng hồ theo dõi sức khỏe cao cấp, đo nhịp tim, oxy trong máu, kết nối mượt mà với điện thoại.",
        price: 9900000,
        stock: 20,
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80"
    }
];

async function main() {
    console.log("Đang tiến hành chèn dữ liệu sản phẩm mẫu vào Database...");
    
    for (const product of sampleProducts) {
        await prisma.product.create({
            data: product
        });
        console.log(`Đã chèn thành công: ${product.name}`);
    }
    
    console.log("🎉 Hoàn tất quá trình chèn dữ liệu!");
}

main()
    .catch((error) => {
        console.error("❌ Lỗi khi chèn dữ liệu:", error);
    })
    .finally(async () => {
        // Đóng kết nối Database sau khi chạy xong để tránh rò rỉ bộ nhớ
        await prisma.$disconnect();
    });