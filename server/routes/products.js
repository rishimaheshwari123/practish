const express = require("express");
const router = express.Router();
const { createProduct } = require("../controller/productCtrl");
const { isAdmin } = require("../middleware/auth");
const auth = require("../model/auth");

// Create a new product (requires authentication)
router.post("/create", auth, isAdmin, createProduct);


module.exports = router;
