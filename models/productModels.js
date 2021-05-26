const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    shortDesc: String,
    longDesc: String,
    imgFile: String,
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;

module.exports = {
  createProduct: async (product) => {
    return await (Product.create(product));
  },
  getAllProducts: async () => {
    return await Product.find({});
  },
  getProduct: async (id) => {
    return await Product.findOne({ _id: id });
  },
  updateProduct: async (id, product) => {
    return await Product.findOneAndUpdate(
      { _id: id },
       product,
      { new: true }
    );
  },
  deleteProduct: async (id) => {
    return await Product.deleteOne({ _id: id });
  },
  deleteAllProducts: async () => {
    return await Product.deleteMany({});
  },
};
