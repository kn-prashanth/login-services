const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = await User.create({
            username,
            email,
            password,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
    const { email, password, twoFACode } = req.body;

    try {
        // Validate email & password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If 2FA is enabled, verify the code
        if (user.is2FAEnabled) {
            if (!twoFACode) {
                return res.status(400).json({ success: false, message: '2FA code is required' });
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                encoding: 'base32',
                token: twoFACode,
            });

            if (!verified) {
                return res.status(401).json({ success: false, message: 'Invalid 2FA code' });
            }
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Enable 2FA
// @route   POST /api/auth/2fa/enable
// @access  Private
exports.enable2FA = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        console.log("enable2FA::user::", user);
        
        if (user.is2FAEnabled) {
            return res.status(400).json({ success: false, message: '2FA is already enabled' });
        }

        const otpauth_url = user.generate2FASecret();
        await user.save();


        // Generate QR code
        QRCode.toDataURL(otpauth_url, (err, data_url) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({
                success: true,
                qrCode: data_url,
                message: 'Scan the QR code with your authenticator app',
            });
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify and confirm enabling 2FA
// @route   POST /api/auth/2fa/verify
// @access  Private
exports.verify2FA = async (req, res, next) => {
    const { twoFACode } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user.twoFASecret) {
            return res.status(400).json({ success: false, message: '2FA is not initiated' });
        }
    
        const verified = speakeasy.totp.verify({
            secret: user.twoFASecret,
            encoding: 'base32',
            token: twoFACode,
        });

        console.log("twoFACode::", twoFACode);
        console.log("user::", user);
        console.log("verified::", verified);

        if (verified) {
            user.is2FAEnabled = true;
            await user.save();
            res.status(200).json({ success: true, message: '2FA enabled successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid 2FA code' });
        }
    } catch (error) {
        next(error);
    }
};
