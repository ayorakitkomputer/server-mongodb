const app = require("../app");
const PORT = process.env.PORT || 3000;
const { connect } = require("../config");

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });