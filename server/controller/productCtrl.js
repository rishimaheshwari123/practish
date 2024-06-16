const Product = require("../model/Product");

const createProduct = async (req, res) => {
  try {
    // Extracting data from the request body
    const { title, description, price, highPrice, quantity, sizes, images } =
      req.body;


    const imagesArray = JSON.parse(req.body.images);


    if (
      !title ||
      !description ||
      !price ||
      !sizes ||
      !quantity ||
      !imagesArray
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }



    // Creating a new product object
    const newProduct = await Product.create({
      title,
      description,
      price,
      highPrice,
      sizes,
      quantity,
      images: imagesArray,
    });

    res.status(200).json({
      success: true,
      data: newProduct,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


module.exports = { createProduct }