const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getMyProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/product/:id").get(getProductDetails);

router.post(
  "/products/new",
  isAuthenticatedUser,
  authorizeRoles("vendor"),
  createProduct
);
router.route("/my_products").get(isAuthenticatedUser, getMyProducts);

router.route("/admin/products").get(isAuthenticatedUser, getAdminProducts);

router.route("/admin/product/:id").put(isAuthenticatedUser, updateProduct);

router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("vendor"), deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
