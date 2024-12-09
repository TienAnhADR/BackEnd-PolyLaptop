const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'chat', required: true }, // ID cuộc trò chuyện
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Người gửi
  content: { type: String, required: true }, // Nội dung tin nhắn
  timestamp: { type: Date, default: Date.now }, // Thời gian gửi
  isRead: { type: Boolean, default: false }, // Trạng thái đã đọc
});

const ChatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }], // Người tham gia
  lastMessage: { type: String, default: '' }, // Nội dung tin nhắn cuối cùng
  updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật cuối
});

module.exports = {
  Message: mongoose.model('message', MessageSchema),
  Chat: mongoose.model('chat', ChatSchema),
};
