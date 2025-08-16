import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
// import { singleUpload } from "../middleware/multer.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllCommentOnMyBlogs,
  getCommentsOfPost,
  likeComment,
} from "../controllers/comment.controller.js";
const router = express.Router();

router.route("/:id/create").post(isAuthenticated, createComment);
router.route("/:id/delete").delete(isAuthenticated, deleteComment);
router.route("/:id/edit").put(isAuthenticated, editComment);
router.route("/:id/comment/all").get(getCommentsOfPost);
router.route("/:id/like").get(isAuthenticated, likeComment);
router.route("/my-blogs/comments").get(isAuthenticated, getAllCommentOnMyBlogs);

export default router;
