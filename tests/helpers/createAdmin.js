const Users = require("../../models/users");
const { sign } = require("../../helpers/jwt");

let access_token = "";
let email;

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

  email = newAdmin.email
  return (access_token = sign(newAdmin));
}

async function deleteAdmin() {
  await Users.destroyEmail(email)
}

module.exports = { createAdmin, deleteAdmin };
