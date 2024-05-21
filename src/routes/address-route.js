import express from "express";

// Controller imports
import addressController from "../controllers/address-controller.js";

// Validator imports
import { listAddressesValidator, addressIdValidator, addressValidator } from "../serializers/validator/address-controller-validator.js";

const route = express();

/**
 * Route to list all the address list based on various conditions
 */
route.get("/", listAddressesValidator, addressController.listAddressesController);

route.post("/", addressValidator, addressController.createAddressController);

route.get("/:addressId", addressIdValidator, addressController.getAddressByIdController);

route.patch("/:addressId", addressIdValidator, addressValidator, addressController.updateAddressController);

route.delete("/:addressId", addressIdValidator, addressController.deleteAddressController);

export default route;


