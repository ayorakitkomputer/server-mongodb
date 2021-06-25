function gpuValidation(data) {
  let validated = true;
  let errors = "";
  if (
    !data.name ||
    !data.image ||
    !data.manufacturer ||
    !data.tdp ||
    !data.price ||
    !data.stock
  ) {
    validated = false;
    errors = "All Field Required";
    return { errors, validated };
  } else if (
    typeof data.name === "string" &&
    typeof data.image === "string" &&
    typeof data.manufacturer === "string" &&
    typeof data.tdp === "number" &&
    typeof data.price === "number" &&
    typeof data.stock === "number"
  ) {
    validated = true;
    return validated;
  } else {
    validated = false;
    errors = "There's an error in your input";
    return { errors, validated };
  }
}

module.exports = gpuValidation;
