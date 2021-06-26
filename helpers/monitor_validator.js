const monitorValidator = (data) => {
  let errors;
  let errorFlag = false

  if (
    data.manufacturer === '' ||
    data.image === '' ||
    data.name === '' ||
    data.size === '' ||
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
    typeof data.size != 'string' ||
    typeof data.price != 'number' ||
    typeof data.stock != 'number'
  ) {
    errorFlag = true
    errors = 'There are errors in the input format'
  }

  return { errors, errorFlag }
}

module.exports = monitorValidator