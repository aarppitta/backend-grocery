import express from 'express';

// Controller imports
import productController from '../controllers/product-controller.js';

// Validator imports
import { listProductsValidator, productIdValidator, productValidator } from '../serializers/validator/product-controller-validator.js';

const route = express();

/**
 * Route to list all the product list based on various conditions
 */

route.get('/', listProductsValidator, productController.listProductsController);

route.post('/', productValidator, productController.createProductController);

route.get('/:productId', productIdValidator, productController.getProductByIdController);

route.patch('/:productId', productIdValidator, productValidator, productController.updateProductController);

route.delete('/:productId', productIdValidator, productController.deleteProductController);

export default route;