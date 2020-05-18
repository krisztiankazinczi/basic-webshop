export default function validate(validationValues) {
  let errorObject = {}
  for (let [key, value] of Object.entries(validationValues)) {

    if (!value) {
      errorObject[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required!`
    } 
    else {
      const result = checkLength(key, value)
      if (result) {
        errorObject[key] = result.errorMessage
      } 
    }
  }
  return errorObject;
}

function checkLength(key, value) {
    if (value.length < 5) {
      return { 'errorMessage': `${key.charAt(0).toUpperCase() + key.slice(1)} is too short!` }
    } 
    return false
}