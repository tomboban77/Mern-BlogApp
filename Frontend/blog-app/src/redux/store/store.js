import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/usersSlice";
import categoriesReducer from "../slices/categorySlice";
import postReducer from "../slices/postsSlice";
import commentReducer from "../slices/commentSlice";
import sendMailReducer from "../slices/emailSlice";
import sendTokenVerificationReducer from "../slices/accountVerificationSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    category: categoriesReducer,
    post: postReducer,
    comment: commentReducer,
    sendMail: sendMailReducer,
    accountToken: sendTokenVerificationReducer,
  },
});

export default store;
