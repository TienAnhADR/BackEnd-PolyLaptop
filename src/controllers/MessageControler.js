const { Chat, Message } = require('../models/Message');

// Tạo cuộc hội thoại mới hoặc tham gia vào cuộc hội thoại đã có của khách hàng
exports.contact = async (req, res) => {
    const customerId = req.user._id;  // Lấy customerId từ thông tin đăng nhập (req.user._id)
    try {
        // Kiểm tra xem cuộc hội thoại đã tồn tại chưa
        const existingChat = await Chat.findOne({
            participants: customerId,
        }).populate('participants','HoTen Role')

        // Nếu đã tồn tại cuộc trò chuyện
        if (existingChat) {
            // Lấy danh sách các tin nhắn trong cuộc trò chuyện
            const messages = await Message.find({ chatId: existingChat._id })
                .sort({ timestamp: 1 }) // Sắp xếp theo thời gian
                .populate("senderId", "HoTen Role");

            // Trả về danh sách tin nhắn cho khách hàng
            return res.status(200).json({
                message: "Lấy danh sách tin nhắn thành công",
                data: {messages, chat: existingChat},
            });
        }
        // Nếu chưa có cuộc trò chuyện, tạo mới cuộc hội thoại
        const newChat = new Chat({
            participants: [customerId], // Chỉ có customerId tham gia ban đầu
        });
        await newChat.save();
        // Trả về thông tin cuộc trò chuyện mới tạo
        res.status(201).json({
            message: 'Tạo cuộc hội thoại mới thành công',
            data: {messages: [], chat: newChat},
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


// API: Lấy danh sách các cuộc hội thoại
exports.getChatsForAdmin = async (req, res) => {
    try {
        // Tìm tất cả các cuộc hội thoại
        const chats = await Chat.find()
            .populate('participants', 'HoTen Role Email') // Lấy thông tin chi tiết participant
            .sort({ updatedAt: -1 }); // Sắp xếp theo thời gian cập nhật mới nhất

        res.status(200).json({
            success: true,
            message: 'Lấy danh sách cuộc hội thoại thành công.',
            data: chats,
        });
    } catch (error) {
        console.error('Error fetching chats for admin:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách cuộc hội thoại.',
        });
    }
};
// cập nhật tin nhắn cuối cùng cho bảng chat
const updateLastMessageInChat = async (chatId, lastMessage) => {
    try {
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating last message:', error);
        throw error;
    }
};
// lấy danh sách tin nhắn trong chat
exports.getMesage = async (req,res)=>{
    const chatId = req.params.id
    try {
        const messages = await Message.find({ chatId })
          .sort({ timestamp: 1 }) // Sắp xếp theo thời gian
          .populate('senderId', 'HoTen Role'); // Lấy thông tin người gửi
        res.status(200).json({message: 'Lấy messager thành công', data: messages})
      } catch (error) {
        res.status(500).json({message: error.message})
      }
}

// gửi tin nhắn mới
exports.sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    const senderId = req.user._id;
  
    try {
      // Tạo tin nhắn mới
      const newMessage = new Message({
        chatId,
        senderId,
        content,
      });
      await newMessage.save();
  
      // Cập nhật tin nhắn cuối cùng trong cuộc hội thoại
      await updateLastMessageInChat(chatId, content);
      const message = await Message.findById(newMessage._id).populate('senderId','HoTen Role')
  
      res.status(201).json({
        success: true,
        message: 'Tin nhắn đã được gửi.',
        data: message,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi gửi tin nhắn.',
      });
    }
  };
  
