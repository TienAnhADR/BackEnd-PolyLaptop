const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Import HTTP Server
const { Server } = require('socket.io'); // Import Socket.IO
require('dotenv').config();

// Import các router
const UserRouter = require('./routers/UserRouter');
const HangRouter = require('./routers/HangRouter');
const SanPhamRouter = require('./routers/SanPhamRouter');
const ChiTietSPRouter = require('./routers/ChiTietSPRouter');
const YeuThichRouter = require('./routers/YeuThichRouter');
const GiohangRouter = require('./routers/GioHangRouter');
const DonHangRouter = require('./routers/DonHangRouter');
const HoaDonRouter = require('./routers/HoaDonRouter');
const DonnHangCTRouter = require('./routers/DonHangCTRouter');
const Thongke = require('./routers/Thongke')
const DanhGia = require('./routers/DanhGiaRouter')
const MessageRouter = require('./routers/MessageRouter'); // API gửi tin nhắn

const app = express();
const server = http.createServer(app); // Tạo HTTP server
const io = new Server(server, {
  cors: {
    origin: `*`, // Thay đổi origin phù hợp với frontend
    methods: ['GET', 'POST'],
  },
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const { method, url } = req;
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${method} request to ${url}`);
  next();
});

// Socket.IO
global.io = io; // Gán `io` vào global để sử dụng trong các router
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Lắng nghe sự kiện tham gia phòng
  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    io.sockets.emit(`joinChat`, socket.id)
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  // Xử lý ngắt kết nối
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  // server lắng nghe tin nhắn mới
  socket.on('new_message', (data) => {
    console.log('tin nhan moi:', data)

    io.sockets.emit("new_message", data)

  })
  socket.on('new_chat_created', data => {
    io.sockets.emit('new_chat_created', data)
  })
});

// Routes
app.use('/auth', UserRouter);
app.use('/hang', HangRouter);
app.use('/san-pham', SanPhamRouter);
app.use('/chi-tiet-san-pham', ChiTietSPRouter);
app.use('/yeu-thich', YeuThichRouter);
app.use('/gio-hang', GiohangRouter);
app.use('/don-hang', DonHangRouter);
app.use('/hoa-don', HoaDonRouter);
app.use('/chi-tiet-don-hang', DonnHangCTRouter);
app.use('/thong-ke', Thongke);
app.use('/chat', MessageRouter);
app.use('/danh-gia', DanhGia)

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
