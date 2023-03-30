const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongoDbId = require("../../utils/validateMongoID");
require("dotenv").config();
const crypto = require("crypto");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");
const cloudinaryUploadImage = require("../../utils/cloudinary");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({
    email: req.body.email,
  });
  if (userExists) {
    throw new Error("User already exists");
  }
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (user && (await user.isPasswordMatched(password))) {
    res.json({
      _id: user?._id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      profilePhoto: user?.profilePhoto,
      isAdmin: user?.isAdmin,
      token: generateToken(user?._id),
      isVerified: user?.isAccountVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).populate("posts");
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check valid id
  validateMongoDbId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  //check valid id
  validateMongoDbId(id);

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  // find login user
  const loginUserId = req?.user?._id?.toString();

  try {
    const userProfile = await User.findById(id)
      .populate("posts")
      .populate("viewedBy");
    //check if this user , if it exists in array of viewedBy
    const alreadyViewed = userProfile?.viewedBy?.find((user) => {
      return user?._id?.toString() === loginUserId;
    });

    if (alreadyViewed) {
      res.json(userProfile);
    } else {
      const profile = await User.findByIdAndUpdate(userProfile?._id, {
        $push: {
          viewedBy: loginUserId,
        },
      });
      res.json(profile);
    }
  } catch (error) {
    res.json(error);
  }
});

const userUpdateCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});
const updatePasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);

  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updateProfile = await user.save();
    res.json(updateProfile);
  }
  res.json(user);
});

const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  const targetUser = await User.findById(followId);

  const alreadyFollowing = targetUser?.followers?.find(
    (user) => user?.toString() === loginUserId.toString()
  );

  if (alreadyFollowing) {
    throw new Error("You have already followed this user");
  }

  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    {
      new: true,
    }
  );
  res.json("User followed success..");
});

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { unfollowUserId } = req.body;

  await User.findByIdAndUpdate(
    unfollowUserId,
    {
      $pull: { followers: _id },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    _id,
    {
      $pull: { following: unfollowUserId },
    },
    { new: true }
  );

  res.json("User Unfollowed Sucess..");
});

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: true,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlocked: false,
    },
    {
      new: true,
    }
  );
  res.json(user);
});

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  //Build yr message

  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    const verificationToken = await user.createAccountVerification();
    //save the user
    await user.save();
    // console.log(verificationToken);

    const resetURL = `You are requested to verify your account within 10 seconds if you havent yet, else ignore the messsage
    <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;

    const msg = {
      to: user?.email,
      from: "tomboban777@gmail.com",
      subject: "My firt email using node",
      html: resetURL,
    };

    await sgMail.send(msg);
    res.json(resetURL);
    // res.json("Email is send");
  } catch (error) {
    res.json(error);
  }
});

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find this user by token

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: {
      $gt: new Date(),
    },
  });
  if (!userFound) throw new Error("Token expired, try again");

  //update the property to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;

  await userFound.save();

  res.send(userFound);
});

const forgetPasswordTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const token = await user.createPasswordResetToken();
    // console.log(token);
    await user.save();
    const resetURL = `You are requested to reset your password within 10 seconds if you havent yet, else ignore the messsage
    <a href="http://localhost:3000/reset-password/${token}">Click to verify your account</a>`;

    const msg = {
      to: "tomboban77@gmail.com",
      from: "tomboban777@gmail.com",
      subject: "Reset Password",
      html: resetURL,
    };
    await sgMail.send(msg);
    res.json({
      message: `A verification message is successfully send to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json(error);
  }
});

const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("User not found, try again later");
  }

  //Change the password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  // find the user
  const { _id } = req.user;

  // get the path to img
  const localPath = `public/images/profile/${req.file.filename}`;

  // to upload to cloudinary
  const imgUpload = await cloudinaryUploadImage(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      //if you want to save locally just replace put localpath below
      profilePhoto: imgUpload?.url,
    },
    { new: true }
  );
  // Remove uploaded images locally
  fs.unlinkSync(localPath);

  res.json(foundUser);

  // console.log(req.file);
});

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  fetchUsersCtrl,
  fetchUserDetailsCtrl,
  deleteUsersCtrl,
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
};
