import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlogs,
  disLikeBlog,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog.controller.js";
const router = express.Router();

router.route("/").post(isAuthenticated, createBlog);
router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog);
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);
router.route("/delete/:id").delete(isAuthenticated, deleteBlogs);
router.route("/:id/like").get(isAuthenticated, likeBlog);
router.route("/:id/dislike").get(isAuthenticated, disLikeBlog);
router.route("/my-blogs/like").get(isAuthenticated, getMyTotalBlogLikes);
router.route("/get-published-blogs").get(isAuthenticated, getPublishedBlog);
router.route("/:blogId").patch(isAuthenticated, togglePublishBlog);

export default router;
