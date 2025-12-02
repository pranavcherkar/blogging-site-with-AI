import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import React, { useRef, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import JoditEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.blogId;
  const { blog, loading } = useSelector((store) => store.blog);
  const selectBlog = blog.find((blog) => blog._id == id);
  const [content, setContent] = useState(selectBlog.description);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  console.log(params);
  const [blogData, setBlogData] = useState({
    title: selectBlog?.title,
    subtitle: selectBlog?.subtitle,
    description: content,
    category: selectBlog?.category,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog?.thumbnail
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  // Function to clean HTML content and extract plain text
  const extractTextFromHTML = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Function to generate title using OpenAI API directly
  const generateTitle = async () => {
    try {
      // Check if there's content in the editor
      if (!content || content.trim() === "") {
        toast.error("Please write some content in the editor first");
        return;
      }

      setIsGeneratingTitle(true);

      // Extract plain text from HTML content
      const plainText = extractTextFromHTML(content);

      // Limit the text to first 1000 characters to avoid token limits
      const textForPrompt = plainText.substring(0, 1000);

      if (textForPrompt.length < 50) {
        toast.error("Please write more content to generate a meaningful title");
        setIsGeneratingTitle(false);
        return;
      }

      // Create prompt for OpenAI
      const prompt = `Based on the following blog content, generate a compelling, SEO-friendly title that is:
- Between 40-60 characters long
- Engaging and click-worthy
- Relevant to the content
- Suitable for the ${blogData.category || "general"} category

Blog Content:
${textForPrompt}

Generate only the title, nothing else:`;

      // Make direct API call to OpenAI
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert content writer who creates compelling blog titles. Always respond with only the title, no quotes, no additional text.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 50,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Store API key in environment
            "Content-Type": "application/json",
          },
        }
      );

      const generatedTitle = response.data.choices[0]?.message?.content?.trim();

      if (generatedTitle) {
        // Clean up the title (remove quotes if present)
        const cleanTitle = generatedTitle.replace(/^["']|["']$/g, "");

        // Update the title in blogData
        setBlogData((prev) => ({
          ...prev,
          title: cleanTitle,
        }));
        toast.success("Title generated successfully!");
      } else {
        toast.error("Failed to generate title. Please try again.");
      }
    } catch (error) {
      console.error("Error generating title:", error);

      // Handle specific OpenAI API errors
      if (error.response?.status === 401) {
        toast.error("Invalid OpenAI API key. Please check your configuration.");
      } else if (error.response?.status === 429) {
        toast.error("OpenAI API rate limit exceeded. Please try again later.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid request to OpenAI API. Please try again.");
      } else {
        toast.error("Error generating title. Please try again.");
      }
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const updateBlogHandler = async () => {
    const forData = new FormData();
    forData.append("title", blogData.title);
    forData.append("subtitle", blogData.subtitle);
    forData.append("description", content);
    forData.append("category", blogData.category);
    forData.append("file", blogData.thumbnail);
    try {
      dispatch(setLoading(true));
      const res = await axios.put(
        `https://blogging-site-with-ai.onrender.com/api/v1/blog/${id}`,
        forData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        console.log(blogData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="md:ml-[320px] pt-20 px-3 ">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-3">
          <h1 className="text-4xl font-bold">Basic Blog Information</h1>
          <p>Make changes to your blogs here.Click public when you are done</p>
          <div className="space-x-2">
            <Button>Publish</Button>
            <Button variant="destructive">Remove Blog</Button>
          </div>
          <div className="pt-10">
            <div className="flex items-center justify-between mb-1">
              <Label>Title</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={generateTitle}
                disabled={isGeneratingTitle}
                className="flex items-center gap-2"
              >
                {isGeneratingTitle ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Title
                  </>
                )}
              </Button>
            </div>
            <Input
              type="text"
              placeholders="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div className="pt-10">
            <Label className="mb-1">Subtitle</Label>
            <Input
              type="text"
              placeholders="Enter a subtitle"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <Label className="mb-1">Description</Label>
            <JoditEditor
              ref={editor}
              className="jodit_toolbar"
              value={blogData.description}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          <div>
            <Label className="mb-1">Category</Label>
            <Select
              onValueChange={selectCategory}
              className="mt-1 dark:border-gray-300"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Technology">Web Technology</SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1">Thumbnail</Label>
            <Input
              type="file"
              id="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit dark:border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Blog Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={updateBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
