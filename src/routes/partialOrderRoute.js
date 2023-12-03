const express = require("express");
const {
  newPartialOrder,
  getSinglePartialOrder,
  myPartialOrders,
  getAllPartialOrders,
  updatePartialOrder,
  deletePartialOrder,
} = require("../controllers/partialOrderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/partialOrder/new").post(isAuthenticatedUser, newPartialOrder);

router
  .route("/partialOrder/:id")
  .get(isAuthenticatedUser, getSinglePartialOrder);

router.route("/partialOrders/me").get(isAuthenticatedUser, myPartialOrders);

router
  .route("/admin/partialOrders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllPartialOrders);

router
  .route("/admin/partialOrder/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updatePartialOrder);

router
  .route("/admin/partialOrder/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deletePartialOrder);

module.exports = router;
