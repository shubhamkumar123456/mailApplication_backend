const express = require('express');
const { createUser, updateUser, loginUser, deleteUser, getUserDetails } = require('../controllers/userController');
const checkToken = require('../middleware/CheckToken');
const router = express.Router();


router.post('/create',createUser);
router.put('/update',checkToken,updateUser)
router.delete('/delete',checkToken,deleteUser)
router.post('/login',loginUser)
router.get('/getUser',checkToken,getUserDetails)


module.exports = router;


