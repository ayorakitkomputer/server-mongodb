const Build = require("../models/builds");
const History = require("../models/history");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "nodemailer.hacktiv8@gmail.com",
		pass: "passworD123",
	},
});

class HistoryController {
	static createHistory(req, res) {
		let doc = {
			user: req.currentUser,
			createdAt: Date.now(),
			shipmentStatus: false,
		};

		Build.findByPk(req.body.buildId)
			.then((data) => {
				if (!data) throw new Error("Build not found");
				doc["build"] = data;
				return History.create(doc);
			})
			.then((data) => {
				res.status(201).json({
					message: `${data.insertedCount} documents were inserted`,
					historyId: data.ops[0]._id,
				});
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getAllHistory(req, res) {
		History.findAllHistory().then((data) => {
			res.status(200).json(data);
		});
	}

	static patchShipment(req, res) {
		const { id } = req.params;
		const doc = { shipmentStatus: req.body.shipmentStatus };
		History.update(doc, id)
			.then((data) => {
				if (data.matchedCount === 1) {
					return History.findByPk(id);
				} else {
					throw new Error("Transaction not found");
				}
			})
			.then((data) => {
				let totalPrice = 0;
				let names = [];

				Object.keys(data.build).forEach((product) => {
					if (Array.isArray(data.build[product])) {
						data.build[product].forEach((el) => {
							console.log(el.price.toLocaleString);
							totalPrice += el.price;
							names.push(/*html*/ `
              <tr>
              <td
                width="75%"
                align="left"
                style="
                  font-family: Open Sans, Helvetica, Arial,
                    sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 24px;
                  padding: 15px 10px 5px 10px;
                "
              >
                ${el.name}
              </td>
              <td
                width="25%"
                align="left"
                style="
                  font-family: Open Sans, Helvetica, Arial,
                    sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 24px;
                  padding: 15px 10px 5px 10px;
                "
              >
                ${el.price.toLocaleString("id-ID", {
									style: "currency",
									currency: "IDR",
								})}
              </td>
            </tr>
              `);
						});
					} else if (product.toString() !== "_id") {
						totalPrice += data.build[product].price;
						console.log(data.build[product].price.toLocaleString);
						names.push(/*html*/ `
              <tr>
              <td
                width="75%"
                align="left"
                style="
                  font-family: Open Sans, Helvetica, Arial,
                    sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 24px;
                  padding: 15px 10px 5px 10px;
                "
              >
                ${data.build[product].name}
              </td>
              <td
                width="25%"
                align="left"
                style="
                  font-family: Open Sans, Helvetica, Arial,
                    sans-serif;
                  font-size: 16px;
                  font-weight: 400;
                  line-height: 24px;
                  padding: 15px 10px 5px 10px;
                "
              >
                ${data.build[product].price.toLocaleString("id-ID", {
									style: "currency",
									currency: "IDR",
								})}
              </td>
            </tr>
              `);
					}
				});

				const mailOptions = {
					from: "nodemailer.hacktiv8@gmail.com",
					to: data.user.email,
					subject: "Your Purchase Has Been Shipped!",
					html: /*html*/ `<html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
          </head>
        
          <body
            style="
              margin: 0 !important;
              padding: 0 !important;
              background-color: #eeeeee;
            "
            bgcolor="#eeeeee"
          >
            <div
              style="
                display: none;
                font-size: 1px;
                color: #fefefe;
                line-height: 1px;
                font-family: Open Sans, Helvetica, Arial, sans-serif;
                max-height: 0px;
                max-width: 0px;
                opacity: 0;
                overflow: hidden;
              "
            >
              For what reason would it be advisable for me to think about business
              content? That might be little bit risky to have crew member like them.
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="background-color: #eeeeee" bgcolor="#eeeeee">
                  <table
                    align="center"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    width="100%"
                    style="max-width: 600px"
                  >
                    <tr>
                      <td
                        align="center"
                        valign="top"
                        style="font-size: 0; padding: 35px"
                        bgcolor="#cfff0a"
                      >
                        <div
                          style="
                            display: inline-block;
                            max-width: 50%;
                            min-width: 100px;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            align="left"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="max-width: 300px"
                          >
                            <tr>
                              <td
                                align="left"
                                valign="top"
                                style="
                                  font-family: Open Sans, Helvetica, Arial, sans-serif;
                                  font-size: 36px;
                                  font-weight: 800;
                                  line-height: 48px;
                                "
                                class="mobile-center"
                              >
                                <h1
                                  style="
                                    font-size: 36px;
                                    font-weight: 800;
                                    margin: 0;
                                    color: #000000;
                                  "
                                >
                                  ARK
                                </h1>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div
                          style="
                            display: inline-block;
                            max-width: 50%;
                            min-width: 100px;
                            vertical-align: top;
                            width: 100%;
                          "
                          class="mobile-hide"
                        >
                          <table
                            align="left"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            style="max-width: 300px"
                          >
                            <tr>
                              <td
                                align="right"
                                valign="top"
                                style="
                                  font-family: Open Sans, Helvetica, Arial, sans-serif;
                                  font-size: 48px;
                                  font-weight: 400;
                                  line-height: 48px;
                                "
                              >
                                <table
                                  cellspacing="0"
                                  cellpadding="0"
                                  border="0"
                                  align="right"
                                >
                                  <tr>
                                    <td
                                      style="
                                        font-family: Open Sans, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 18px;
                                        font-weight: 400;
                                      "
                                    >
                                      <p
                                        style="
                                          font-size: 18px;
                                          font-weight: 400;
                                          margin: 0;
                                          color: #ffffff;
                                        "
                                      >
                                        <a
                                          href="#"
                                          target="_blank"
                                          style="color: #000000; text-decoration: none"
                                          >Shop &nbsp;</a
                                        >
                                      </p>
                                    </td>
                                    <td
                                      style="
                                        font-family: Open Sans, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 18px;
                                        font-weight: 400;
                                        line-height: 24px;
                                      "
                                    >
                                      <a
                                        href="#"
                                        target="_blank"
                                        style="color: #ffffff; text-decoration: none"
                                        ><img
                                          src="https://img.icons8.com/color/48/000000/small-business.png"
                                          width="27"
                                          height="23"
                                          style="display: block; border: 0px"
                                      /></a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="center"
                        style="padding: 35px 35px 20px 35px; background-color: #ffffff"
                        bgcolor="#ffffff"
                      >
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          style="max-width: 600px"
                        >
                          <tr>
                            <td
                              align="center"
                              style="
                                font-family: Open Sans, Helvetica, Arial, sans-serif;
                                font-size: 16px;
                                font-weight: 400;
                                line-height: 24px;
                                padding-top: 25px;
                              "
                            >
                              <img
                                src="https://img.icons8.com/carbon-copy/100/000000/checked-checkbox.png"
                                width="125"
                                height="120"
                                style="display: block; border: 0px"
                              /><br />
                              <h2
                                style="
                                  font-size: 30px;
                                  font-weight: 800;
                                  line-height: 36px;
                                  color: #333333;
                                  margin: 0;
                                "
                              >
                                Thank You For Your Order!
                              </h2>
                            </td>
                          </tr>
                         
                          <tr>
                            <td align="left" style="padding-top: 20px">
                              <table
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                width="100%"
                              >
                                <tr>
                                  <td
                                    width="75%"
                                    align="left"
                                    bgcolor="#eeeeee"
                                    style="
                                      font-family: Open Sans, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 800;
                                      line-height: 24px;
                                      padding: 10px;
                                    "
                                  >
                                    Transaction #
                                  </td>
                                  <td
                                    width="25%"
                                    align="left"
                                    bgcolor="#eeeeee"
                                    style="
                                      font-family: Open Sans, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 800;
                                      line-height: 24px;
                                      padding: 10px;
                                    "
                                  >
                                    ${data._id}
                                  </td>
                                  </tr>
                                ${names.map((table) => {
																	return table;
																})}
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="left" style="padding-top: 20px">
                              <table
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                width="100%"
                              >
                                <tr>
                                  <td
                                    width="75%"
                                    align="left"
                                    style="
                                      font-family: Open Sans, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 800;
                                      line-height: 24px;
                                      padding: 10px;
                                      border-top: 3px solid #eeeeee;
                                      border-bottom: 3px solid #eeeeee;
                                    "
                                  >
                                    TOTAL
                                  </td>
                                  <td
                                    width="25%"
                                    align="left"
                                    style="
                                      font-family: Open Sans, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 800;
                                      line-height: 24px;
                                      padding: 10px;
                                      border-top: 3px solid #eeeeee;
                                      border-bottom: 3px solid #eeeeee;
                                    "
                                  >
                                    ${totalPrice.toLocaleString("id-ID", {
																			style: "currency",
																			currency: "IDR",
																		})}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="center"
                        height="100%"
                        valign="top"
                        width="100%"
                        style="padding: 0 35px 35px 35px; background-color: #ffffff"
                        bgcolor="#ffffff"
                      >
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          style="max-width: 660px"
                        >
                          <tr>
                            <td align="center" valign="top" style="font-size: 0">
                              <div
                                style="
                                  display: inline-block;
                                  max-width: 50%;
                                  min-width: 240px;
                                  vertical-align: top;
                                  width: 100%;
                                "
                              >
                                <table
                                  align="left"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  style="max-width: 300px"
                                >
                                  <tr>
                                    <td
                                      align="left"
                                      valign="top"
                                      style="
                                        font-family: Open Sans, Helvetica, Arial,
                                          sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        line-height: 24px;
                                      "
                                    >
                                      <p style="font-weight: 800">Delivery Address</p>
                                      <p>${data.user.address}</p>
                                    </td>
                                  </tr>
                                </table>
                              </div>
                              <div
                                style="
                                  display: inline-block;
                                  max-width: 50%;
                                  min-width: 240px;
                                  vertical-align: top;
                                  width: 100%;
                                "
                              >
                                <table
                                  align="left"
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  width="100%"
                                  style="max-width: 300px"
                                ></table>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="center"
                        style="padding: 35px; background-color: #cfff0a"
                        bgcolor="#1b9ba3"
                      >
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          style="max-width: 600px"
                        >
                          <tr>
                            <td
                              align="center"
                              style="
                                font-family: Open Sans, Helvetica, Arial, sans-serif;
                                font-size: 16px;
                                font-weight: 400;
                                line-height: 24px;
                                padding-top: 25px;
                              "
                            >
                              <h2
                                style="
                                  font-size: 24px;
                                  font-weight: 800;
                                  line-height: 30px;
                                  color: #000000;
                                  margin: 0;
                                "
                              >
                                Come Shop With Ark Again
                              </h2>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 25px 0 15px 0">
                              <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td
                                    align="center"
                                    style="border-radius: 5px"
                                    bgcolor="#66b3b7"
                                  >
                                    <a
                                      href="#"
                                      target="_blank"
                                      style="
                                        font-size: 18px;
                                        font-family: Open Sans, Helvetica, Arial,
                                          sans-serif;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 5px;
                                        background-color: #000000;
                                        padding: 15px 30px;
                                        border: 1px solid #000000;
                                        display: block;
                                      "
                                      >Shop Again</a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="center"
                        style="padding: 35px; background-color: #ffffff"
                        bgcolor="#ffffff"
                      >
                        <table
                          align="center"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          width="100%"
                          style="max-width: 600px"
                        >
                          <tr>
                            <td align="center">
                              <img
                                src="https://cdn.discordapp.com/attachments/857558201851445250/859364209418043392/LOGO_TES.png"
                                width="450"
                                height="200"
                                style="display: block; border: 0px"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="center"
                              style="
                                font-family: Open Sans, Helvetica, Arial, sans-serif;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 24px;
                                padding: 5px 0 10px 0;
                              "
                            >
                              <p
                                style="
                                  font-size: 14px;
                                  font-weight: 800;
                                  line-height: 18px;
                                  color: #333333;
                                "
                              >
                                Jakarta,<br />
                                Indonesia
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="left"
                              style="
                                font-family: Open Sans, Helvetica, Arial, sans-serif;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 24px;
                              "
                            >
                              <p
                                style="
                                  font-size: 14px;
                                  font-weight: 400;
                                  line-height: 20px;
                                  color: #777777;
                                "
                              >
                                If you didn't create an account using this email
                                address, please ignore this email or
                                <a href="#" target="_blank" style="color: #777777"
                                  >unsusbscribe</a
                                >.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
				};
				console.log(totalPrice.toLocaleString);
				transporter.sendMail(mailOptions, (err, data) => {
					if (err) {
						console.log(err, "err in sending email");
					} else {
						console.log(data, "email sent");
					}
				});
				res.status(200).json({ message: `Updated 1 document(s)` });
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getHistory(req, res) {
		History.findAll(req.currentUser.id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getOne(req, res) {
		History.findByPk(req.params.id)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = HistoryController;
