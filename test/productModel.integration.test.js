const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const Database = require("../database/mongodb");
const Product = require("../models/productModels");
const User = require("../models/usersModel");
const usersDB = mongoose.model("users");
const app = require("../app");

chai.should();
const { expect } = chai;
chai.use(chaiHttp);

describe("Integration Testing - Product Model", () => {
  before("Connect to database before running the test", async () => {
    await Database.connect();
  });

  beforeEach("Clear database before running each test", async () => {
    await Product.deleteAllProducts();
    await usersDB.deleteMany({});

    const arrangedProduct1 = {
        title: "String 1",
        price: 1,
        shortDesc: "String 1",
        longDesc: "String 1",
        imgFile: "String 1",
      },
      arrangedProduct2 = {
        title: "String 2",
        price: 1,
        shortDesc: "String 2",
        longDesc: "String 2",
        imgFile: "String 2",
      };

    const product1 = await Product.createProduct(arrangedProduct1);
    const product2 = await Product.createProduct(arrangedProduct2);
    this.products = [product1, product2];

    const user = await User.createUserModel({
      email: "admin",
      password: "admin",
    });

    this.admin = await usersDB.findByIdAndUpdate(
      user._id,
      { role: "admin" },
      { new: true }
    );

    this.adminToken = await User.loginUserModel({
      email: this.admin.email,
      password: "admin",
    });
  });

  after("Disconnect from database after running the test", async () => {
    await Database.disconnect();
  });

  it("should create a product", async () => {
    // Arrange
    const product = {
      title: "String",
      price: 1010,
      shortDesc: "String",
      longDesc: "String",
      imgFile: "String",
    };

    // Act
    await chai
      .request(app)
      .post("/api/products")
      .set("Content-type", "application/json")
      .set("authorization", `Bearer ${this.adminToken.token}`)
      .send(product)
      .then((res) => {
        // Assert
        expect(res).to.have.status(201);
        expect(res.body).to.be.a("object");
        expect(res.body.price).to.equal(1010);
      });
  });

  it("should get all products", async () => {
    // Act
    await chai
      .request(app)
      .get("/api/products")
      .then((res) => {
        // Assert
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body[0].price).to.equal(1);
        expect(res.body.length).to.equal(2);
      });
  });

  it("should get a product", async () => {
    // Act
    await chai
      .request(app)
      .get(`/api/products/${this.products[0]._id}`)
      .then((res) => {
        // Assert
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.price).to.equal(1);
      });
  });

  it("should delete a product", async () => {
    // Act
    await chai
      .request(app)
      .delete(`/api/products/${this.products[0]._id}`)
      .set("authorization", `Bearer ${this.adminToken.token}`)

      .then(async (res) => {
        const product = await Product.getProduct(this.products[0]._id);

        // Assert
        expect(res).to.have.status(200);
        expect(product).to.equal(null);
      });
  });

  it("should update a product", async () => {
    let newProduct = {
      title: "String 1",
      price: 10,
      shortDesc: "String 1",
      longDesc: "String 1",
      imgFile: "String 1",
    };
    // Act
    await chai
      .request(app)
      .patch(`/api/products/${this.products[0]._id}`)
      .set("authorization", `Bearer ${this.adminToken.token}`)

      .send({
        newProduct,
      })
      .then(async (res) => {
        const product = await Product.getProduct(this.products[0]._id);

        expect(res).to.have.status(200);
        expect(product.price).to.equal(10);
      });
  });
});
