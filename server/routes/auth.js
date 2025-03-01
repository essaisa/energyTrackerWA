const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();
require("dotenv").config();

// Register a new user
router.post(
    "/register",
    [
        body("email", "Invalid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "User already exists" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({ email, password: hashedPassword });
            await user.save();

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ msg: "Server error" });
        }
    }
);

// Login user
router.post(
    "/login",
    async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Invalid credentials" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ msg: "Server error" });
        }
    }
);

module.exports = router;
