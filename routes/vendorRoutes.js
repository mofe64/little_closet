const express = require('express');
const sellerController = require('../controllers/sellerController');

const router = express.Router();

router.route('/:id/product/new').post(sellerController.addProduct);
router.route('/:id/products').get(sellerController.getAllProducts);
router
  .route('/:id/products/:productid')
  .get(sellerController.getProduct)
  .patch(sellerController.updateProduct)
  .delete(sellerController.removeProduct);

router.route('/:id/deactivate').patch(sellerController.deactivate);

module.exports = router;
