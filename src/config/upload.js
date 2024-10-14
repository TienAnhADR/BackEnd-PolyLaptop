const multer = require('multer')
const path = require('path')
const fs = require('fs')
// Cấu hình multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads');  // Thư mục lưu ảnh
    },
    filename: function (req, file, cb) {
        const filePath = path.join(__dirname, 'uploads', file.originalname); // Đảm bảo đường dẫn chính xác
        if (fs.existsSync(filePath)) {
            cb(null, file.originalname);  // Nếu file đã tồn tại, dùng lại tên cũ
        } else {
            cb(null, file.originalname);  // Nếu file chưa tồn tại, tạo tên mới
        }
    }
});

// Xuất cấu hình multer để tái sử dụng
const upload = multer({ storage: storage });

module.exports = upload;