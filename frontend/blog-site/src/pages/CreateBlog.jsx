import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import React, { useState } from "react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setBlog } from "../redux/blogSlice";
import { setLoading } from "../redux/authSlice";
import { Loader2 } from "lucide-react";
const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading } = useSelector((store) => store.blog);
  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createBlogHandler = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `https://blogging-site-with-ai.onrender.com/api/v1/blog/`,
        { title, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        if (!blog) {
          dispatch(setBlog([res.data.blog]));
          navigate(`/dashboard/write-blog/${res.data.blog._id}`);
          toast.success(res.data.message);
        }
        dispatch(setBlog([...blog, res.data.blog]));
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-2-">
      <Card className="md:p-10 p-4 dark:bg-gray-800 -space-y-6">
        <h1 className="text-2xl font-bold"> Lets create blog</h1>
        <p>Lorem ipsum</p>
        <div className="mt-10">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Your Blog Name"
              className="bg-white dark:bg-gray-700 mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mt-4 mb-5">
            <Label className="mb-1">Category</Label>
            <Select onValueChange={getSelectedCategory} className="mt-1">
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
          <div className="flex gap-2">
            <Button disabled={loading} onClick={createBlogHandler}>
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateBlog;
