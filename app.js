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
// jourdy
const router = require('./routes')
app.use(router)
//


app.use(indexRouter);

// connect()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Running on ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = app;
