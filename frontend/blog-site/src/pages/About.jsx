import React from "react";
import aboutImg from "../assets/About-blog.avif";

const About = () => {
  return (
    <div className="min-h-screen pt-28 px-4 md:px-0 mb-7">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="md:text-5xl text-4xl font-extrabold mb-4">
            About Our Blog
          </h1>
          <p className="text-lg">
            Where creativity meets AI to make blogging smarter and easier.
          </p>
        </div>

        {/* Image + Text Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={aboutImg}
            alt="Blog Illustration"
            className="w-full h-72 object-cover rounded-2xl shadow-md"
          />
          <div>
            <p className="text-lg mb-4">
              Welcome to our Blog App — a space designed for writers, readers,
              and innovators. Here, you can share your ideas, explore fresh
              perspectives, and connect with a community that values creativity
              and knowledge.
            </p>
            <p className="text-lg mb-4">
              What makes us different? We’ve integrated{" "}
              <span className="font-semibold">AI-powered tools</span>
              to help you write better and faster. From generating blog titles
              to suggesting improvements, our AI features are built to spark
              creativity while keeping your unique voice at the center.
            </p>
            <p className="text-lg mb-4">
              Whether you’re an experienced blogger or just starting out, you’ll
              find simple tools to write, publish, and engage with your audience
              in meaningful ways.
            </p>
            <p className="text-lg">
              Thank you for being part of our growing community — together,
              we’re shaping the future of blogging.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl italic text-gray-500">
            "Words are powerful — AI just helps you unlock them."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About;
