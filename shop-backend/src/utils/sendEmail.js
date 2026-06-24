import nodemailer from 'nodemailer';

// 1. Khởi tạo "Bưu cục" (Transporter) với cấu hình Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. Định nghĩa hàm giao thư
export const sendEmail = async ({ to, subject, html }) => {
    try {
        // 3. Đóng gói bức thư (mailOptions)
        const mailOptions = {
            from: `"Minh Nhut Shop" <${process.env.EMAIL_USER}>`, // Tên người gửi hiển thị cho đẹp
            subject: subject,
            to: to,
            html
        };

        // 4. Giao việc cho bưu cục đi gửi
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Đã gửi email thành công tới: ", info.accepted);

    } catch (error) {
        console.error("❌ Lỗi khi gửi email: ", error);
        throw new Error("Không thể gửi email lúc này.");
    }
};