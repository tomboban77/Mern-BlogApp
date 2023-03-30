const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "Post title is required"],
    },
    category: {
      type: String,
      required: [true, "Post category is required"],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // required: [true, "Please Author is required"],
    },
    description: {
      type: String,
      // required: [true, "Post description is required"],
    },
    image: {
      type: String,
      default: "https://pixabay.com/photos/barn-owl-owl-bird-animal-3052382/",
    },
  },
  {
    // convert all ids to json
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//populate comments
PostSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
