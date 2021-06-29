const Axios = require("axios");

class XenditController {
	static createInvoice(req, res) {
		const { amount } = req.body;
		Axios.post(
			"https://api.xendit.co/v2/invoices",
			{
				external_id: `invoice-${Date.now()}`,
				amount,
				payer_email: req.currentUser.email,
				description: "PC Builds from ARK",
				should_send_email: true,
				reminder_time_unit: "hours",
				reminder_time: "1",
			},
			{
				auth: {
					username: process.env.XENDIT_KEY,
					password: "",
				},
			}
		)
			.then(({ data }) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.response.data.message });
			});
	}
}

module.exports = XenditController;
