import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import MainImg from "../assets/mainimg2.png";
const MainPage = () => {
  return (
    <div className="px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center h-[600px] my-10 md:my-0 ">
        {/* text section */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get All the Latest Tech Trends
          </h1>
          <p className="text-lg md:text-xl opacity-80 mb-6">
            {" "}
            Keep Updating with in-depth blogs, tutorials, and insights on
            technology, Blockchain and AI
          </p>
          <div className=" flex space-x-4">
            <Link>
              <Button className="text-lg">Get Started</Button>
            </Link>
            <Link>
              <Button
                variant="outline"
                className="border-white px-6 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* image section */}
          <img
            src={MainImg}
            alt="Image"
            className="md:h-[600px] md:w-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
