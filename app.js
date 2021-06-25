if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const { connect } = require("./config");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// jourdy
const router = require('./routes')
app.use(router)
//


connect()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Running on ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
