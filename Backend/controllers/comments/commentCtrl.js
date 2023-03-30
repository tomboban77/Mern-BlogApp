const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/comment");
const validateMongoDbId = require("../../utils/validateMongoID");

//create a comment
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { postId, description } = req.body;
  const user = req.user;
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//fetch all comments
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // sort in ascending order. new post
    const comments = await Comment.find({}).sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//fetch single comment
const fetchSingleCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const comment = await Comment.findById(id);

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//update single comment
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { postId, description } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  const user = req.user;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        user,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//delete single comment
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const comment = await Comment.findByIdAndDelete(id);

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchSingleCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
