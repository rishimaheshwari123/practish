const authModel = require("../model/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerCtrl = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide all fields"
            })
        }

        const existingUser = await authModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "This account is already exist please login"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await authModel.create({ name, email, password: hashedPassword });

        res.status(201).send({
            message: "Account created successfully!",
            user
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error in register api!"
        })
    }
}
const loginCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Provide all fields"
            });
        }

        const user = await authModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This account does not exist, please register first"
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
                httpOnly: true,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User login success",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in login API",
            error: error.message
        });
    }
};





module.exports = { registerCtrl, loginCtrl }