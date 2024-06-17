const express = require("express");
const router = express.Router();
const { createProduct } = require("../controller/productCtrl");
const { isAdmin, auth } = require("../middleware/auth");

// Create a new product (requires authentication)
router.post("/create", auth, isAdmin, createProduct);


module.exports = router;
