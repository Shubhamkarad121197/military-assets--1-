require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/military_assets");

app.use("/api/auth", require("./routes/auth"));   
app.use("/api/purchases", require("./routes/purchases"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/expenditure", require("./routes/expenditure"));


app.use("/api/dashboard", require("./routes/dashboard"));

app.listen(5000, () => console.log("Server running on 5000"));
