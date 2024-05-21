import express from 'express';

// Controller imports
import cartController from '../controllers/cart-controller.js';

// Validator imports
import { listCartsValidator, cartIdValidator, cartValidator } from '../serializers/validator/cart-controller-validator.js';

const route = express();

/**
 * Route to list all the cart list based on various conditions
 */

route.get('/', listCartsValidator, cartController.listCartsController);

route.post('/', cartValidator, cartController.createCartController);

route.get('/:cartId', cartIdValidator, cartController.getCartByIdController);

route.patch('/:cartId', cartIdValidator, cartValidator, cartController.updateCartController);

route.delete('/:cartId', cartIdValidator, cartController.deleteCartController);

export default route;