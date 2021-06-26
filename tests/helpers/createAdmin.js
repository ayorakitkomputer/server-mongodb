const Users = require("../../models/users");
const { sign } = require("../../helpers/jwt");

let access_token = "";

async function createAdmin() {
  let userAdmin = {
    email: "admin@mail.com",
    password: "password",
    address: "Jakarta",
    firstname: "Admin",
    lastname: "PcPartPicker",
    role: "Admin",
  };
  const user = await Users.create(userAdmin);

  let newAdmin = {
    id: user.ops[0]._id,
    email: user.ops[0].email,
    role: user.ops[0].role,
  };
  return (access_token = sign(newAdmin));
}

module.exports = { createAdmin };
