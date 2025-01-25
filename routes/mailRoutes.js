const express = require('express');
const { sendMail, deleteSentMail, getSentmail, getRecievedMail } = require('../controllers/mailController');
const checkToken = require('../middleware/CheckToken');
const router = express.Router();

router.post('/create',checkToken,sendMail)
router.delete('/delete/:_id',checkToken,deleteSentMail)
router.get('/sentMails',checkToken,getSentmail)
router.get('/getMail',checkToken,getRecievedMail)


module.exports = router