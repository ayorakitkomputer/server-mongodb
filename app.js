if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { connect } = require("./config");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const indexRouter = require("./routes/index");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.use(indexRouter);

module.exports = app;
