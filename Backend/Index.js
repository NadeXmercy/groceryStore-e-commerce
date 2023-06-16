const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 5000;

const options = {
  serverSelectionTimeoutMS: 30000,
  useNewUrlParser: true,
  useCreateIndex: true,
};
mongoose
  .connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    options
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.log("Error connection to database!", err);
  });

// SCHEMA PRINT

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmpassword: String,
  image: String,
});

// moadal

const userModel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("server is  working");
});

// signup api

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = userModel(req.body);
      const saveData = await data.save();
      console.log("User data saved:", saveData);
      res.send({ message: "Sign up successful", alert: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Login API

app.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({ message: "Login successful", alert: true, data: dataSend });
    } else {
      res.send({ message: "Email is not valid", alert: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// product section
const schemaProduct = mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  image: String,
  price: { type: Number, required: true },
  discription: String, // typo corrected from "discription"
});

const productModel = mongoose.model("newproduct", schemaProduct);

// Save product in database

app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body);
  const newProduct = new productModel(req.body);
  const dataSave = await newProduct.save();
  console.log("Product data saved:", dataSave);
  res.send({ message: "Data sent successfully" });
});

// get data

app.get("/newproduct", async (req, res) => {
  const newdata = await productModel.find({})
  res.json(newdata);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
