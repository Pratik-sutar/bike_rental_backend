const express = require("express");
const {
  registerVendor,
  loginVendor,
  vendorForgotPassword,
  vendorResetPassword,
  vendorLogout,
  getVendorDetails,
  vendorUpdatePassword,
  vendorUpdateProfile,
  getAllVendors,
  getSingleVendor,
  updateVendorRole,
  deleteVendor,
} = require("../controllers/vendorController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/vendor/register").post(registerVendor);

router.route("/vendor/login").post(loginVendor);

router.route("/vendor/password/forgot").post(vendorForgotPassword);
// // https://myaccount.google.com/lesssecureapps for security settings

router.route("/vendor/password/reset/:token").put(vendorResetPassword);

router.route("/vendor/logout").get(vendorLogout);

router.route("/vendor/me").get(isAuthenticatedUser, getVendorDetails);

router
  .route("/vendor/password/update")
  .put(isAuthenticatedUser, vendorUpdatePassword);

router.route("/vendor/me/update").put(isAuthenticatedUser, vendorUpdateProfile);

router
  .route("/vendor/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllVendors);

router
  .route("/vendor/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleVendor);

router
  .route("/vendor/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateVendorRole);

router
  .route("/vendor/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteVendor);

module.exports = router;
