import express from 'express';

//Controller imports
import userController from '../controllers/user-controller.js';

//Validator imports
import { listUsersValidator, userIdValidator, userValidator } from '../serializers/validator/user-controller-validator.js';

const route = express();

/**
 * Route to list all the user list based on various conditions
 */

route.get('/', listUsersValidator, userController.listUsersController);

route.post('/', userValidator, userController.createUserController);

route.get('/:userId', userIdValidator, userController.getUserByIdController);

route.patch('/:userId', userIdValidator, userValidator, userController.updateUserController);

route.delete('/:userId', userIdValidator, userController.deleteUserController);

export default route;