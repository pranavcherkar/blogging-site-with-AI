import { Blog } from "../models/blog.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
//create blog
export const createBlog = async (req, res) => {
  console.log("Into create Blog");
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        message: "Blog title and category required",
      });
    }
    const blog = await Blog.create({
      title,
      category,
      author: req.id,
    });
    return res.status(201).json({
      success: true,
      blog,
      message: "Blog created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create Blog",
    });
  }
};
//update blog
export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category } = req.body;
    const file = req.file;
    let blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      thumbnail = await cloudinary.uploader.upload(fileUri);
    }
    const updateData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
      thumbnail: thumbnail?.secure_url,
    };
    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
    return res.status(200).json({
      success: true,
      message: " blog updated successfully",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating blog",
    });
  }
};

//get own blogs
export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }
    const blogs = await Blog.find({ author: userId }).populate({
      path: "author",
      select: "firstname lastname photoURL",
    });
    if (!blogs) {
      return res.status(404).json({
        message: "No Blogs",
        blogs: [],
        success: false,
      });
    }
    return res.status(200).json({
      blogs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};
// delete blogs
export const deleteBlogs = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    if (blog.author.toString() !== authorId) {
      return res.status(403).json({
        success: false,
        message: "Not authorize to delete this blog",
      });
    }
    //Delete blog
    await Blog.findByIdAndDelete(blogId);
    return res.status(200).json({
      success: true,
      message: "deleted blog successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
//get Published blog
export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "firstname, lastname photoURL" });
    if (!blogs) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
    });
  }
};
//to publish any blog
export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { publish } = req.query; //true or false
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found!",
      });
    }
    // publish status based on the query paramter
    blog.isPublished = !blog.isPublished;
    await blog.save();
    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get update  blogs status",
    });
  }
};

//like Blog
export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const likedByUser = req.id;
    const blog = await Blog.findById(blogId).populate({ path: "likes" });
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }
    // Check if user already liked the blog
    // const alreadyLiked = blog.likes.includes(userId);

    //like logic started
    await blog.updateOne({ $addToSet: { likes: likedByUser } });
    await blog.save();
    return res.status(200).json({ message: "Blog liked", blog, success: true });
  } catch (error) {
    console.log(error);
  }
};

//dislike Blog
export const disLikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const likedByUser = req.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found", success: false });
    }

    //dislike logic started
    await blog.updateOne({ $pull: { likes: likedByUser } });
    await blog.save();
    return res
      .status(200)
      .json({ message: "Blog disliked", blog, success: true });
  } catch (error) {
    console.log(error);
  }
};

// get all my likes
export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const userId = req.id;
    const myBlogs = await Blog.find({ author: userId }).select("likes");
    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0
    );
    res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch all likes", success: false });
  }
};
