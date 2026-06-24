import axios from 'axios'
import CryptoJS from 'crypto-js'
import moment from 'moment'
import 'dotenv/config' 

const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT,
    
}

export const createZaloPayOrder = async (orderInfo) => {
    // tạo mã đơn hàng unique theo  yêu cầu của zalopay (định dạng: YYMMDD_id)
    const transID = Math.floor(Math.random() * 1000000)
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`

    // cấu hình gói dữ liệu đi
    const order = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, // Mã giao dịch của mình
        app_user: "user123", // Cái này có thể truyền tên user từ DB vào
        app_time: Date.now(), 
        item: JSON.stringify(orderInfo.items), // Chi tiết món hàng
        embed_data: JSON.stringify({ 
            // Dữ liệu đính kèm để lát ZaloPay trả về nguyên vẹn cho mình
            merchantinfo: "Minh Nhut Shop",
            orderId: orderInfo.orderId
        }),
        amount: orderInfo.totalAmount, // Tổng tiền (Bắt buộc)
        description: `Thanh toán đơn hàng #${orderInfo.orderId}`,
        bank_code: "", // Mở trực tiếp app ZaloPay (nếu dùng điện thoại)
        callback_url: "https://rink-herald-outreach.ngrok-free.dev/api/orders/zalopay-callback"
    }
         

    // tạo chữ kí bảo mật (quan trọng nhất)
    // Phải ghép đúng thứ tự: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        // 4. Gọi API sang ZaloPay để xin Link thanh toán
        const result = await axios.post(config.endpoint, null, { params: order });
        
        // Nếu thành công, ZaloPay sẽ trả về một cái link (order_url)
        return result.data; 
    } catch (error) {
        console.error("Lỗi tạo đơn ZaloPay:", error.message);
        throw error;
    }
}