import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { configureStore } from "@reduxjs/toolkit";

import Post from "./Post.js";
import User from "./User.js";

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
  })

export default configureStore({
    reducer: {
        post: Post,
        user: User
    },
    middleware: (getDefaultMiddleware) => customizedMiddleware
});