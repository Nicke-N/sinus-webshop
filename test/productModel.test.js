const chai = require("chai");
chai.should();
const { expect } = require("chai");
const Database = require("../database/mongodb");
const Product = require("../models/productModels");

describe("Unit Testing - Product Model", () => {
  before("Connect to database before running the test", async () => {
    await Database.connect();
  });

  beforeEach("Clear database before running each test", async () => {
    await Product.deleteAllProducts();
  });

  after("Disconnect from database after running the test", async () => {
    await Database.disconnect();
  });

  it("should create a product", async () => {
    // Arrange
    const arrangedProduct = {
      title: "String",
      price: 1,
      shortDesc: "String",
      longDesc: "String",
      imgFile: "String",
    };

    // Act
    const result = await Product.createProduct(arrangedProduct);

    // Assert
    result.should.be.an("object");
    result.should.have.property("title");
    result.should.have.property("price");
    result.should.have.property("shortDesc");
    result.should.have.property("longDesc");
    result.should.have.property("imgFile");
  });

  it("should get all products", async () => {
    // Arrange
    const arrangedProducts = [
      {
        _id: "5f686467fab56c53dcacfb25",
        title: "String 1",
        price: 1,
        shortDesc: "String 1",
        longDesc: "String 1",
        imgFile: "String 1",
      },
      {
        _id: "5f68648c49227a2510a68eb2",
        title: "String 2",
        price: 1,
        shortDesc: "String 2",
        longDesc: "String 2",
        imgFile: "String 2",
      },
    ];

    await Product.createProduct(arrangedProducts);

    // Act
    const result = await Product.getAllProducts();

    // Assert
    expect(result).to.be.an("array");
    expect(result).to.have.length(2);
    expect(result).to.have.lengthOf(2);
  });

  it("should get a product", async () => {
    // Arrange
    const arrangedProduct = {
      _id: "5f686467fab56c53dcacfb25",
      title: "String 1",
      price: 1,
      shortDesc: "String 1",
      longDesc: "String 1",
      imgFile: "String 1",
    };

    const product = await Product.createProduct(arrangedProduct);

    // Act
    const result = await Product.getProduct(product._id);

    // Assert
    expect(result).to.be.an("object");
    expect(result).to.have.property("_id");
    expect(result).to.have.property("title");
    expect(result).to.have.property("price");
    expect(result).to.have.property("shortDesc");
    expect(result).to.have.property("longDesc");
    expect(result).to.have.property("imgFile");
  });

  it("should update a product", async () => {
    // Arrange
    const arrangedProduct = {
      _id: "5f686467fab56c53dcacfb25",
      title: "String 1",
      price: 1,
      shortDesc: "String 1",
      longDesc: "String 1",
      imgFile: "String 1",
    };

    const product = await Product.createProduct(arrangedProduct);

    const updatedProduct = {
      title: "String 1 Updated",
      price: 123,
    };

    // Act
    const result = await Product.updateProduct(product._id, updatedProduct);

    // Assert
    expect(result).to.have.property("title", "String 1 Updated");
    expect(result).to.have.property("price", 123);
  });

  it("should delete a product", async () => {
    // Arrange
    const arrangedProduct = {
      _id: "5f686467fab56c53dcacfb25",
      title: "String 1",
      price: 1,
      shortDesc: "String 1",
      longDesc: "String 1",
      imgFile: "String 1",
    };

    const product = await Product.createProduct(arrangedProduct);

    // Act
    const result = await Product.deleteProduct(product._id);

    // Assert
    expect(result).to.have.property("deletedCount", 1);
  });
});
