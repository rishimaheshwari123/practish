const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const authModel = require("../model/auth");
dotenv.config();

exports.auth = async (req, res, next) => {
	try {
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({ success: false, message: "Token Missing" });
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
		} catch (error) {
			return res.status(401).json({ success: false, message: "Invalid Token" });
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error while validating the token",
		});
	}
};

exports.isUser = async (req, res, next) => {
	try {
		const userDetails = await authModel.findOne({ email: req.user.email });
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (userDetails.role !== "user") {
			return res.status(403).json({
				success: false,
				message: "Access restricted to users only",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to verify user role",
		});
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await authModel.findOne({ email: req.user.email });
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (userDetails.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Access restricted to admins only",
			});
		}
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Unable to verify admin role",
		});
	}
};
