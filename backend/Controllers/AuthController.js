const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                status: 409,
                success: false,
                message: 'User already exists, please log in.',
                data: null
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Signup successful',
            data: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'Invalid email or password',
                data: null
            });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'Invalid email or password',
                data: null
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Login successful',
            data: {
                token: jwtToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};

module.exports = { signup, login };
