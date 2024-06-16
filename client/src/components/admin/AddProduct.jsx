import React, { useState } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddProduct() {
  const [images, setImages] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const imageUpload = async (data) => {
    let result = [];
    console.log("Uploading images:", data);
    const toastId = toast.loading("Loading...");
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("thumbnail", data[i]);
      }
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/image/multi`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Image upload response:", response);
      if (!response?.data?.success) {
        throw new Error("Could Not Add IMAGE Details");
      }
      toast.success("IMAGE Details Added Successfully");
      result = response?.data?.images;
    } catch (error) {
      console.log("CREATE IMAGE API ERROR:", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  };

  const uploadImage = async (acceptedFiles) => {
    const response = await imageUpload(acceptedFiles);
    console.log("Uploaded images response:", response);

    const uploadedImages = response?.map((image) => ({
      public_id: image.asset_id,
      url: image.url,
    }));
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const removeImage = (publicId) => {
    const updatedImages = images.filter(
      (image) => image.public_id !== publicId
    );
    setImages(updatedImages);
  };

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    price: "",
    highPrice: "",
    quantity: "",
    sizes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("highPrice", formValues.highPrice);
    formData.append("quantity", formValues.quantity);
    formData.append("sizes", formValues.sizes);
    formData.append("images", JSON.stringify(images));

    try {
      console.log("Submitting form with token:", token);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/product/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("CREATE PRODUCT API RESPONSE:", response);
      if (response?.data?.success) {
        toast.success("PRODUCT Details Added Successfully");
        setFormValues({
          title: "",
          description: "",
          price: "",
          highPrice: "",
          quantity: "",
          sizes: "",
        });
        setImages([]);
      } else {
        throw new Error("Could Not Add PRODUCT Details");
      }
    } catch (error) {
      console.log("CREATE PRODUCT API ERROR:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="text-center space-y-2 font-bold">Add Product</div>
      <form onSubmit={handleSubmit} className="product">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            placeholder="Enter Your Product Name"
            type="text"
            onChange={handleChange}
            value={formValues.title}
            className="form-input mt-1 block w-full rounded-md border-blue-500 ring ring-blue-200"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter Your Product description"
            name="description"
            onChange={handleChange}
            value={formValues.description}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700">
            Price
          </label>
          <input
            id="price"
            placeholder="Enter Your Product Price"
            name="price"
            type="number"
            onChange={handleChange}
            value={formValues.price}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="highPrice" className="block text-gray-700">
            High Price
          </label>
          <input
            id="highPrice"
            name="highPrice"
            placeholder="Enter Your Product HighRate"
            type="number"
            onChange={handleChange}
            value={formValues.highPrice}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-gray-700">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="Enter Your Product Quantity"
            onChange={handleChange}
            value={formValues.quantity}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sizes" className="block text-gray-700">
            Sizes
          </label>
          <input
            id="sizes"
            name="sizes"
            type="text"
            onChange={handleChange}
            value={formValues.sizes}
            className="form-input mt-1 block w-full"
          />
        </div>

        <div className="bg-white border-2 border-blue-600 mb-[20px] p-[50px] text-center">
          <Dropzone onDrop={(acceptedFiles) => uploadImage(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>

      <div className="flex gap-10 mt-[50px] flex-wrap">
        {images?.map((image, index) => (
          <div className="relative" key={index}>
            <button
              type="button"
              onClick={() => removeImage(image.public_id)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={image.url}
              alt=""
              className="w-40 h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddProduct;
