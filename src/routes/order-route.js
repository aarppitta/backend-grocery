import express from 'express';

// Controller imports
import orderController from '../controllers/order-controller.js';

// Validator imports

import { listOrdersValidator, orderIdValidator, orderValidator } from '../serializers/validator/order-controller-validator.js';

const route = express();

/**
 * Route to list all the order list based on various conditions
 */

route.get('/', listOrdersValidator, orderController.listOrdersController);

route.post('/', orderValidator, orderController.createOrderController);

route.get('/:orderId', orderIdValidator, orderController.getOrderByIdController);   

route.patch('/:orderId', orderIdValidator, orderValidator, orderController.updateOrderController);

route.delete('/:orderId', orderIdValidator, orderController.deleteOrderController);

export default route;