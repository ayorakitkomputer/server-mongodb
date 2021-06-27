const Users = require("../../models/users");
const { sign } = require("../../helpers/jwt");

let access_token = "";
let userCustomer = {};

async function createCustomer() {
  userCustomer = {
    email: "customer@mail.com",
    password: "password",
    address: "Jakarta",
    firstname: "Customer",
    lastname: "PcPartPicker",
    role: "Customer",
  };
  const user = await Users.create(userCustomer);

  userCustomer = {
    id: user.ops[0]._id,
    email: user.ops[0].email,
    role: user.ops[0].role,
  };
  return (access_token = sign(userCustomer));
}

module.exports = { createCustomer, userCustomer };
