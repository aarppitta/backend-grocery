/**
 * Function which is used to check the given string is an email or not
 * @param { string } email
 * @returns
 */
const isEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const emailValidator = {
  isEmail,
};

export default emailValidator;
