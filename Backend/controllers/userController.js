const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ username, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
};

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body; // `identifier` can be either email or username

    try {
        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Get logged-in user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


exports.resetPassword = async (req, res) => {
    const userId = req.userId;
    const { prevPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(prevPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect previous password' });

        const hashedNew = await bcrypt.hash(newPassword, 10);
        user.password = hashedNew;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during password reset' });
    }
};
