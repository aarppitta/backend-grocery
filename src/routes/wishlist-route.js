import express from 'express';

// Controller imports
import wishlistController from '../controllers/wishlist-controller.js';

// Validator imports
import { listWishlistsValidator, wishlistIdValidator, wishlistValidator } from '../serializers/validator/wishlist-controller-validator.js';

const route = express();

/**
 * Route to list all the wishlist list based on various conditions
 */

route.get('/', listWishlistsValidator, wishlistController.listWishlistsController);

route.post('/', wishlistValidator, wishlistController.createWishlistController);

route.get('/:wishlistId', wishlistIdValidator, wishlistController.getWishlistByIdController);

route.patch('/:wishlistId', wishlistIdValidator, wishlistValidator, wishlistController.updateWishlistController);

route.delete('/:wishlistId', wishlistIdValidator, wishlistController.deleteWishlistController);

export default route;