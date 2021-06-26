const Users = require("../../models/users");
const { sign } = require("../../helpers/jwt");

let access_token = "";

function createAdmin() {
  let userAdmin = {
    email: "admin@mail.com",
    password: "password",
    address: "Jakarta",
    firstname: "Admin",
    lastname: "PcPartPicker",
    role: "Admin",
  };

  Users.create(userAdmin)
    .then((data) => {
      let newAdmin = {
        _id: data._id,
        email: data.email,
        role: data.role,
      };
      access_token = sign(newAdmin);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { createAdmin, access_token };
