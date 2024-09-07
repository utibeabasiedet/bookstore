const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
  loginStatus,
  getUser,
} = require("../controllers/userController");
const { protect , adminMiddleware} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get("/all", protect,adminMiddleware, getAllUsers);
router.delete("/:id", protect, deleteUser);
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/login-status", loginStatus);


module.exports = router;
