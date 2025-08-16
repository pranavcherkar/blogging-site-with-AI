import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Sparkles, X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BlogCard = ({ blog }) => {
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString("en-GB");
  const navigate = useNavigate();

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");

  // Function to clean HTML content and extract plain text
  const extractTextFromHTML = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Function to generate summary using OpenAI API
  const generateSummary = async () => {
    try {
      if (!blog.description || blog.description.trim() === "") {
        toast.error("Blog content is not available for summarization");
        return;
      }

      setIsGeneratingSummary(true);

      // Extract plain text from HTML content
      const plainText = extractTextFromHTML(blog.description);

      // Limit the text for API efficiency (first 2000 characters)
      const textForPrompt = plainText.substring(0, 2000);

      if (textForPrompt.length < 100) {
        toast.error(
          "Blog content is too short to generate a meaningful summary"
        );
        setIsGeneratingSummary(false);
        return;
      }

      // Create prompt for OpenAI
      const prompt = `Please create a concise and engaging summary of the following blog post in 2-3 sentences. The summary should capture the main points and be interesting enough to encourage readers to read the full article:

Blog Content:
${textForPrompt}

Summary:`;

      // Make direct API call to OpenAI
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert content summarizer. Create concise, engaging summaries that capture the essence of blog posts in 2-3 sentences.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedSummary =
        response.data.choices[0]?.message?.content?.trim();

      if (generatedSummary) {
        setSummary(generatedSummary);
        setShowSummary(true);
        toast.success("Summary generated successfully!");
      } else {
        toast.error("Failed to generate summary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);

      // Handle specific OpenAI API errors
      if (error.response?.status === 401) {
        toast.error("Invalid OpenAI API key. Please check your configuration.");
      } else if (error.response?.status === 429) {
        toast.error("OpenAI API rate limit exceeded. Please try again later.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid request to OpenAI API. Please try again.");
      } else {
        toast.error("Error generating summary. Please try again.");
      }
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const closeSummary = () => {
    setShowSummary(false);
    setSummary("");
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-600 p-5 rounded-2xl shadow-lg border hover:scale-105 transition-all">
      <img src={blog.thumbnail} alt="" className="rounded-lg" />
      <p className="text-sm mt-2">
        By {blog.author.firstname} | {blog.category} | {formattedDate}
      </p>
      <h2 className="text-xl font-semibold">{blog.title}</h2>
      <h3 className="text-gray-500 mt-1">{blog.subtitle}</h3>

      {/* Summary Section */}
      {showSummary && summary && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              AI Summary
            </h4>
            <button
              onClick={closeSummary}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="flex-1 px-4 py-2 rounded-lg text-sm"
        >
          Read More
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={generateSummary}
          disabled={isGeneratingSummary}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
        >
          {isGeneratingSummary ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Summarize
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BlogCard;
