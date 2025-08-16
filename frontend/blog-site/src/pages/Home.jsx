import RecentBlogs from "../components/RecentBlogs";
import MainPage from "../components/MainPage";
import { Button } from "../components/ui/button";
import React from "react";
import PopularAuthors from "../components/PopularAuthors";

const Home = () => {
  return (
    <div className="pt-20">
      <MainPage />
      <RecentBlogs />
      <PopularAuthors />
    </div>
  );
};

export default Home;
