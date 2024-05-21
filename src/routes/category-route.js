import express from 'express';

// Controller imports
import categoryController from '../controllers/category-controller.js';

// Validator imports
import { listCategoriesValidator, categoryIdValidator, categoryValidator } from '../serializers/validator/category-controller-validator.js';

const route = express();

/**
 *  Route to list all the category list based on various conditions
 */

route.get('/', listCategoriesValidator, categoryController.listCategoriesController);

route.post('/', categoryValidator, categoryController.createCategoryController);

route.get('/:categoryId', categoryIdValidator, categoryController.getCategoryByIdController);

route.patch('/:categoryId', categoryIdValidator, categoryValidator, categoryController.updateCategoryController);

route.delete('/:categoryId', categoryIdValidator, categoryController.deleteCategoryController);

export default route;