import express from 'express';

// Controller imports
import paymentController from '../controllers/payment-controller.js';

// Validator imports

import { listPaymentsValidator, paymentIdValidator, paymentValidator } from '../serializers/validator/payment-controller-validator.js';

const route = express();

/**
 * Route to list all the payment list based on various conditions
 */

route.get('/', listPaymentsValidator, paymentController.listPaymentsController);

route.post('/', paymentValidator, paymentController.createPaymentController);

route.get('/:paymentId', paymentIdValidator, paymentController.getPaymentByIdController);

route.patch('/:paymentId', paymentIdValidator, paymentValidator, paymentController.updatePaymentController);

route.delete('/:paymentId', paymentIdValidator, paymentController.deletePaymentController);

export default route;
