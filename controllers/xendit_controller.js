const Xendit = require("xendit-node");
const Axios = require("axios");

class XenditController {
	static getVirtualAccounts(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});
		const { VirtualAcc } = x;
		const va = new VirtualAcc();

		va.getVABanks()
			.then((response) => {
				res.status(200).json(response);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static createVirtualAccount(req, res) {
		const { bankCode, expectedAmt } = req.body;
		const name = req.currentUser.firstname + " " + req.currentUser.lastname;

		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});
		const { VirtualAcc } = x;
		const va = new VirtualAcc();

		const externalID = `id-${Date.now()}`;

		const expirationDate = new Date();
		const dayToExpire = 2;
		expirationDate.setDate(expirationDate.getDate() + dayToExpire);

		va.createFixedVA({
			externalID,
			bankCode,
			name,
			expectedAmt,
			isClosed: true,
			expirationDate,
			isSingleUse: true,
		})
			.then((response) => {
				res.status(200).json(response);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static payVirtualAccount(req, res) {
		const { externalID, amount } = req.body;
		Axios.post(
			`https://api.xendit.co/callback_virtual_accounts/external_id=${externalID}/simulate_payment`,
			{
				amount,
			},
			{
				auth: {
					username: process.env.XENDIT_KEY,
					password: "",
				},
			}
		)
			.then(({ data }) => {
				console.log(data);
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.response.data.message });
			});
	}

	static allCallback(req, res) {
		res.status(200).json({ message: `Payment success` });
	}

	static createEWalletPayment(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});
		const { EWallet } = x;
		const ewalletSpecificOptions = {};
		const ew = new EWallet(ewalletSpecificOptions);

		const { phone, ewalletType, amount } = req.body;

		ew.createPayment({
			externalID: Date.now().toString(),
			amount,
			phone,
			ewalletType,
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}

	static getEWalletDetail(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});
		const { EWallet } = x;
		const ew = new EWallet();

		ew.getPayment({
			externalID: req.body.external_id,
			ewalletType: req.body.ewallet_type,
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => res.status(500).json({ message: err.message }));
	}

	static createCreditCharge(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});

		const { Card } = x;
		const card = new Card({});

		const tokenID = "60d9964d616b5e002083bdb3"; //https://js.xendit.co/test_tokenize.html
		const authID = "60d9978d616b5e002083bdc4"; //https://js.xendit.co/test_authenticate.html

		const amount = req.body.amount;

		card
			.createCharge({
				tokenID,
				authID,
				amount,
				externalID: Date.now().toString(),
				capture: false,
			})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getCreditDetail(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});

		const { Card } = x;
		const card = new Card({});

		const { chargeID, amount } = req.body; //ChargeID dari atas
		card
			.captureCharge({
				chargeID,
				amount,
			})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static createRetailCharge(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});

		const { RetailOutlet } = x;
		const ro = new RetailOutlet({});

		const { expectedAmt, retailOutletName } = req.body;

		ro.createFixedPaymentCode({
			externalID: Date.now().toString(),
			retailOutletName, //Alfamart || Indomaret
			name: req.currentUser.firstname,
			expectedAmt,
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static getRetailDetails(req, res) {
		const x = new Xendit({
			secretKey: process.env.XENDIT_KEY,
		});

		const { RetailOutlet } = x;
		const ro = new RetailOutlet({});

		const { id, expectedAmt } = req.body; //id hasil dari atas

		ro.updateFixedPaymentCode({
			id,
			expectedAmt,
		})
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	}

	static payRetailStore(req, res) {
		const { retail_outlet_name, payment_code, transfer_amount } = req.body;
		Axios.post(
			"https://api.xendit.co/fixed_payment_code/simulate_payment",
			{
				retail_outlet_name,
				payment_code,
				transfer_amount,
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
				res.status(500).json({ message: err.message });
			});
	}
}

module.exports = XenditController;
