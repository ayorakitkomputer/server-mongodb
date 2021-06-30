const cpuValidator = (data) => {
  let errors;
  let errorFlag = false

  if (
    data.manufacturer === '' ||
    data.image === '' ||
    data.name === '' ||
    data.socket === '' ||
    data.igpu === '' ||
    data.tdp === '' || data.tdp <= 0 ||
    data.price === '' ||data.price <= 0 ||
    data.stock === '' || data.stock <= 0
  ) {
    errorFlag = true
    errors = 'All fields are required and an input number must not be less than 0'
  }

  if (
    typeof data.manufacturer != 'string' ||
    typeof data.image != 'string' ||
    typeof data.name != 'string' ||
    typeof data.socket != 'string' ||
    typeof data.igpu != 'boolean' ||
    typeof data.tdp != 'number' ||
    typeof data.price != 'number' ||
    typeof data.stock != 'number'
  ) {
    errorFlag = true
    errors = 'There are errors in the input format'
  }

  return { errors, errorFlag }
}

module.exports = cpuValidator