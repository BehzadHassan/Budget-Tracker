const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, resetPassword } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.put('/reset-password', auth, resetPassword);

module.exports = router;

