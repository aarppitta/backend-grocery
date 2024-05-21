import bcrypt from "bcryptjs";
const saltRounds = 10;

const BcryptService = class {
  /**
   * Function which is used to generate hash from password
   * @param { string } password
   * @returns
   */
  hash = async (password) => {
    let hash = await bcrypt.hash(password, saltRounds);
    return hash;
  };

  /**
   * Function which is used to compare hashed password and plain password
   * @param { string } password
   * @param { string } hash
   * @returns
   */
  compare = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    if (!match) throw { status: 400, statusCode: 400, message: "Bad credentials" };
    return match;
  };
};

const bcryptService = new BcryptService();

export default bcryptService;
