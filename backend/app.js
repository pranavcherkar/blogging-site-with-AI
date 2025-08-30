import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.routes.js";
import blogRoute from "./routes/blog.routes.js";
import commentRoute from "./routes/comment.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
// import path from "path";
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: /http:\/\/localhost(:5173|:80)?/,
    credentials: true,
  })
);

// const __dirname = onratechange.resolve();
///apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/comment", commentRoute);

// Serve static files from the correct path
// app.use(express.static(path.join(__dirname, "../frontend/blog-site/dist")));

// // Fallback route for SPA
// app.get("*", (_, res) => {
//   res.sendFile(
//     path.resolve(__dirname, "../frontend/blog-site/dist", "index.html")
//   );
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
  connectDB();
});
