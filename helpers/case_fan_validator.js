function caseFanValidation(data) {
  let validated = true;
  let errors = "";
  if (!data.name || !data.image || !data.size || !data.price || !data.stock) {
    validated = false;
    errors = "All Field Required";
    return { errors, validated };
  } else if (
    typeof data.name === "string" &&
    typeof data.image === "string" &&
    typeof data.size === "number" &&
    typeof data.price === "number" &&
    typeof data.stock === "number"
  ) {
    return { validated };
  } else {
    validated = false;
    errors = "There's an error in your input";
    return { errors, validated };
  }
}

module.exports = caseFanValidation;
