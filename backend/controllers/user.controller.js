import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
export const register = async (req, res) => {
  console.log("Incoming body:", req.body);

  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email syntax",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password must be at least 6 characters",
      });
    }

    //checking existing user
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already existed",
      });
    }

    //hashing the password afterwards
    const hashpassword = await bcrypt.hash(password, 10);
    /// saving the data if everything is validated
    await User.create({
      firstname,
      lastname,
      email,
      password: hashpassword,
    });

    return res.status(200).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

/////login controller//////////
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email or password required",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User doesn't exist!",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        status: false,
        message: "Incorrect password",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict",
      })
      .json({
        status: true,
        message: `Welcome back ${user.firstname}`,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
//////logout controller /////////

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      status: true,
      message: "logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

/////user profile editor////
export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const {
      firstName,
      lastName,
      occupation,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;
    // console.log("first stage entered");

    // First, get the user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Handle file upload if present
    let cloudResponse;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      // console.log("Cloudinary upload:", cloudResponse);
      user.photoURL = cloudResponse.secure_url;
    }

    // Update user data
    if (firstName) user.firstname = firstName;
    if (lastName) user.lastname = lastName;
    if (occupation) user.occupation = occupation;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;
    if (bio) user.bio = bio;

    await user.save();

    return res.status(200).json({
      message: "Profile Updated Successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update profile",
      success: false,
    });
  }
};
// export const updateProfile = async (req, res) => {
//   // console.log("first stage entered");
//   try {
//     const userId = req.id;
//     const {
//       firstName,
//       lastName,
//       occupation,
//       bio,
//       instagram,
//       facebook,
//       linkedin,
//       github,
//     } = req.body;
//     console.log("first stage entered");
//     const file = req.file;
//     // const fileUri = getDataUri(file);
//     // let cloudResponse;
//     // if (req.file) {
//     //   const fileUri = getDataUri(req.file);
//     //   const cloudResponse = await cloudinary.uploader.upload(fileUri);
//     //   console.log("Cloudinary upload:", cloudResponse);
//     //   user.photoURL = cloudResponse.secure_url;
//     // }

//     const user = await User.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//         success: false,
//       });
//     }
//     let cloudResponse;
//     if (req.file) {
//       const fileUri = getDataUri(req.file);
//       const cloudResponse = await cloudinary.uploader.upload(fileUri);
//       console.log("Cloudinary upload:", cloudResponse);
//       user.photoURL = cloudResponse.secure_url;
//     }
//     //updating data
//     if (firstName) user.firstname = firstName;
//     if (lastName) user.lastname = lastName;
//     if (occupation) user.occupation = occupation;
//     if (instagram) user.instagram = instagram;
//     if (facebook) user.facebook = facebook;
//     if (linkedin) user.linkedin = linkedin;
//     if (github) user.github = github;
//     if (bio) user.bio = bio;
//     if (file) user.photoURL = cloudResponse.secure_url;
//     // console.log(cloudResponse);
//     await user.save();
//     return res.status(200).json({
//       message: "Profile Updated Successfully",
//       success: true,
//       user,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Failed to update profile",
//       success: false,
//     });
//   }
// };
// export const updateProfile = async (req, res) => {
//   console.log("Profile update initiated");
//   try {
//     const userId = req.id;
//     const {
//       firstName,
//       lastName,
//       occupation,
//       bio,
//       instagram,
//       facebook,
//       linkedin,
//       github,
//     } = req.body;

//     const file = req.file;
//     let cloudResponse;

//     if (file) {
//       const fileUri = getDataUri(file);
//       cloudResponse = await cloudinary.uploader.upload(fileUri);
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Apply updates only if values are provided
//     if (firstName) user.firstname = firstName;
//     if (lastName) user.lastname = lastName;
//     if (occupation) user.occupation = occupation;
//     if (bio) user.bio = bio;
//     if (instagram) user.instagram = instagram;
//     if (facebook) user.facebook = facebook;
//     if (linkedin) user.linkedin = linkedin;
//     if (github) user.github = github;
//     if (file && cloudResponse) user.photoURL = cloudResponse.secure_url;

//     await user.save();

//     const { password, ...userData } = user._doc;

//     return res.status(200).json({
//       success: true,
//       message: "Profile Updated Successfully",
//       user: userData,
//     });
//   } catch (error) {
//     console.error("Error in updateProfile:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update profile",
//     });
//   }
// };

//get all users

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
