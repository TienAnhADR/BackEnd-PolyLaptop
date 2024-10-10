const express = require('express')
const mongoose = require('mongoose')
const UserRouter = require('./routers/UserRouter')
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})