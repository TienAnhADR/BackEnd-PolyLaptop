const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const { contact, getChatsForAdmin,sendMessage ,getMesage} = require('../controllers/MessageControler')

router.post('/contact',protect,contact)
router.get('/',protect,admin,getChatsForAdmin)
router.post('/send-message',protect,sendMessage)
router.get('/messages/:id',protect,admin,getMesage)
module.exports = router