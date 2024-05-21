import express from 'express';

// Controller imports
import contactController from '../controllers/contact-controller.js';

// Validator imports
import { listContactsValidator, contactIdValidator, contactValidator } from '../serializers/validator/contact-controller-validator.js';

const route = express();

/**
 * Route to list all the contact list based on various conditions
 */

route.get('/', listContactsValidator, contactController.listContactsController);

route.post('/', contactValidator, contactController.createContactController);

route.get('/:contactId', contactIdValidator, contactController.getContactByIdController);

route.patch('/:contactId', contactIdValidator, contactValidator, contactController.updateContactController);

route.delete('/:contactId', contactIdValidator, contactController.deleteContactController);

export default route;