const express = require("express");

const {
  userRegisterCtrl,
  userLoginCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  userUpdateCtrl,
  updatePasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middleware/proPhotoMiddleware");

const usersRoute = express.Router();

usersRoute.post("/register", userRegisterCtrl);
usersRoute.post("/login", userLoginCtrl);
//image
usersRoute.put(
  "/profile-photo-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);
usersRoute.get("/", authMiddleware, fetchUsersCtrl);
usersRoute.get("/profile/:id", authMiddleware, userProfileCtrl);
usersRoute.put("/password", authMiddleware, updatePasswordCtrl);
usersRoute.post("/reset-password-token", forgetPasswordTokenCtrl);
usersRoute.put("/reset-password", passwordResetCtrl);
usersRoute.put("/follow", authMiddleware, followingUserCtrl);
usersRoute.post(
  "/generate-verify-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
usersRoute.put("/verify-account", authMiddleware, accountVerificationCtrl);
usersRoute.put("/unfollow", authMiddleware, unfollowUserCtrl);
usersRoute.put("/block-user/:id", authMiddleware, blockUserCtrl);
usersRoute.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
usersRoute.put("/", authMiddleware, userUpdateCtrl);
usersRoute.get("/:id", fetchUserDetailsCtrl);
usersRoute.delete("/:id", deleteUsersCtrl);

module.exports = usersRoute;
