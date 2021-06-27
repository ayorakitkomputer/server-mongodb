const { verify } = require("../helpers/jwt");
const Users = require("../models/users");

module.exports = (req, res, next) => {
    if (!req.headers.access_token) {
        res.status(400).json({ message: "Please Login First" });
    } else {
        const decoded = verify(req.headers.access_token);
        Users.findByPk(decoded.id)
            .then((data) => {
                if (data) {
                    let { _id, email, firstname, lastname, address, role } =
                        data;
                    req.currentUser = {
                        id: _id,
                        email,
                        firstname,
                        lastname,
                        address,
                        role,
                    };
                    next();
                } else {
                    res.status(400).json({ message: "Invalid Token" });
                }
            })
            .catch((err) => {
                res.status(500).json({ message: err.message });
            });
    }
};
