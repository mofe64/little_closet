const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/new', categoryController.createCategory);
router.get('/all', categoryController.getAllCategories);
router
  .route('/:slug')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
