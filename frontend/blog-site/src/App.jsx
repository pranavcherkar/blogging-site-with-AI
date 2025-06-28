import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/Blogs",
    element: (
      <>
        <Navbar /> <Blogs />
      </>
    ),
  },
  {
    path: "/About",
    element: (
      <>
        <Navbar /> <About />
      </>
    ),
  },
  {
    path: "/Signup",
    element: (
      <>
        <Navbar /> <Signup />
      </>
    ),
  },
  {
    path: "/Login",
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
