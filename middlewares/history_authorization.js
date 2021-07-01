const History = require("../models/history");

module.exports = (req, res, next) => {
    let id = req.params.id;
    History.findByPk(id)
        .then((data) => {
            if (data.user.id.toString() === req.currentUser.id.toString()) {
                next();
            } else {
                res.status(400).json({ message: "Unauthorized" });
            }
        })
        .catch((err) => {
            // res.status(500).json({ message: err.message });
        });
};
