const DonHang = require('../models/DonHang');
const DonHangCT = require('../models/DonHangCT');
const HoaDon = require('../models/HoaDon')
exports.getThongke = async (req,res)=>{
// Hàm để tính ngày đầu tuần và ngày cuối tuần từ số tuần và năm
// function getStartAndEndOfWeek(year, weekNumber) {
//     const firstDayOfYear = new Date(year, 0, 1);
//     const daysOffset = (weekNumber - 1) * 7;
//     const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset));
//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6);
//     return { startOfWeek, endOfWeek };
// }
// API thống kê doanh thu theo tuần

    const { startOfWeek, endOfWeek } = req.query;

    if (!startOfWeek || !endOfWeek) {
        return res.status(400).json({ message: 'Yêu cầu nhập đủ thông tin năm và số tuần' });
    }

    try {
        // const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(Number(year), Number(weekNumber));

        // Mảng để lưu trữ doanh thu từng ngày
        const dailyRevenue = Array(7).fill(0);
        let totalRevenue =0; // Biến lưu tổng doanh thu trong tuần

        // Lấy các đơn hàng trong khoảng thời gian của tuần đã chọn
        const orders = await HoaDon.find({
            NgayNhanHang: { $gte: startOfWeek, $lte: endOfWeek },
             
        });
        
         
        
        for (const order of orders) {
            // Lấy ngày hóa đơn được tạo (NgayNhanHang)
            const orderDate = new Date(order.NgayNhanHang);
        
            // Chuyển đổi ngày hóa đơn thành chỉ số ngày trong tuần (0 - Thứ 2, ..., 6 - Chủ nhật)
            const Dayindex = (orderDate.getDay() + 6) % 7; // Chuyển Chủ nhật (0) thành 6, các ngày khác giảm đi 1.
        
            // Tính doanh thu từng ngày
            dailyRevenue[Dayindex] += order.TongTien;
        
            // Tính doanh thu 1 tuần
            totalRevenue += order.TongTien;
        }
        

        res.json({ totalRevenue, dailyRevenue});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tính doanh thu hàng tuần' });
    }
}

