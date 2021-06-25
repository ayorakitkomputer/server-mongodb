function caseValidation(data) {
  let validated = true;
  let errors = "";
  if (
    !data.name ||
    !data.image ||
    !data.form_factor ||
    !data.price ||
    !data.stock
  ) {
    validated = false;
    errors = "All Field Required";
    return { errors, validated };
  } else if (
    typeof data.name === "string" &&
    typeof data.image === "string" &&
    typeof data.form_factor === "string" &&
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

module.exports = caseValidation;
