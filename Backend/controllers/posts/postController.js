const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/post");
const Filter = require("bad-words");
const validateMongoDbId = require("../../utils/validateMongoID");
const User = require("../../model/user/User");
const cloudinaryUploadImage = require("../../utils/cloudinary");
const fs = require("fs");

// Create a post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  //   validateMongoDbId(req.body.user);
  const { _id } = req.user;
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  // block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating failed as it contains profane words. You have been blocked"
    );
  }
  // get the path to img
  const localPath = `public/images/post/${req.file.filename}`;

  // to upload to cloudinary
  const imgUpload = await cloudinaryUploadImage(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUpload?.url,
      user: _id,
    });
    // console.log(post);
    res.json(post);
    // Remove uploaded images locally
    // fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

//Fetch all posts

const fetchAllPostCtrl = expressAsyncHandler(async (req, res) => {
  // if a model has a field that stores ids of the user, after fetching use populate()
  const hasCategory = req.query.category;
  try {
    if (hasCategory) {
      const allPosts = await Post.find({ category: hasCategory })
        .populate("user")
        .populate("comments")
        .sort("-createdAt");
      res.json(allPosts);
    } else {
      const allPosts = await Post.find({})
        .populate("user")
        .populate("comments")
        .sort("-createdAt");
      res.json(allPosts);
    }
  } catch (error) {
    res.json(error);
  }
});

//fetch single post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes")
      .populate("comments");

    //update number of views
    //$inc: increment
    await Post.findByIdAndUpdate(
      post.id,
      {
        $inc: {
          numViews: 1,
        },
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const post = await Post.findByIdAndUpdate(id, {
      ...req.body,
      user: req.user?._id,
    });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//DeletePost
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const post = await Post.findByIdAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//Likes

const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  // find post to be liked
  const { postId } = req.body;
  const post = await Post.findById(postId);

  // find the login user id
  const loginUserId = req?.user?._id;
  // find user has  already liked the post
  const alreadyLiked = post?.isLiked;
  // find if user has already disliked the post
  const alreadyDisliked = post?.disLikes?.find(
    (id) => id?.toString() === loginUserId?.toString()
  );

  // remove user from dislikes array
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //if already liked, toggle,remove user from likes array

  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },

      {
        new: true,
      }
    );
    res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  const { postId } = req.body;

  const post = await Post.findById(postId);

  const loginUserId = req?.user?._id;

  const alreadyDisLiked = post?.isDisLiked;

  const alreadyLikes = post?.likes?.find(
    (id) => id.toString() === loginUserId?.toString()
  );

  if (alreadyLikes) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }

  if (alreadyDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchAllPostCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
};
