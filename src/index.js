const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const UserRouter = require('./routers/UserRouter')
const HangRouter = require('./routers/HangRouter')
const SanPhamRouter = require('./routers/SanPhamRouter')
const ChiTietSPRouter = require('./routers/ChiTietSPRouter')
const YeuThichRouter = require('./routers/YeuThichRouter')
const GiohangRouter = require('./routers/GioHangRouter')
const DonHangRouter = require('./routers/DonHangRouter')

require('dotenv').config()
const app = express()

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB Connected'))
.catch((err)=> console.log('MongoDB connection err', err))
const port = process.env.PORT || 5000





app.use(express.json())
app.use((req, res, next) => {
  const { method, url } = req;
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${method} request to ${url}`);
  next(); // Đảm bảo gọi next() để yêu cầu tiếp tục đến route handler
});
app.use('/auth',UserRouter)
app.use('/hang',HangRouter)
app.use('/san-pham',SanPhamRouter)
app.use('/chi-tiet-san-pham',ChiTietSPRouter)
app.use('/yeu-thich',YeuThichRouter)
app.use('/gio-hang',GiohangRouter)
app.use('/don-hang',DonHangRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})