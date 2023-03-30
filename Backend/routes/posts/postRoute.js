const express = require("express");
const {
  createPostCtrl,
  fetchAllPostCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
} = require("../../controllers/posts/postController");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  photoUpload,
  postImgResize,
} = require("../../middleware/proPhotoMiddleware");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  createPostCtrl
);

postRoutes.put("/likes", authMiddleware, toggleAddLikeToPostCtrl);
postRoutes.put("/dislikes", authMiddleware, toggleAddDislikeToPostCtrl);

postRoutes.get("/", fetchAllPostCtrl);
postRoutes.get("/:id", fetchPostCtrl);
postRoutes.put("/:id", authMiddleware, updatePostCtrl);
postRoutes.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoutes;
