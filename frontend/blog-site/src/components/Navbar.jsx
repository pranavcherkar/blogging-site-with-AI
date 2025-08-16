import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/LogoOg.png";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "../redux/authSlice";
import { toggleTheme } from "../redux/themeSlice";
import { HiMenuAlt1 } from "react-icons/hi";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import userLogo from "../assets/user.jpg";
import ResponsiveMenu from "./ResponsiveMenu";
const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNav, setOpenNav] = useState(false);
  // const {loading} = useSelector((store)=> store.loading)
  const { theme } = useSelector((store) => store.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async (e) => {
    try {
      const res = await axios.get(`http://localhost:8086/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.status) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || error.message || "Logout failed"
      );
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const toggleNav = () => {
    setOpenNav(!openNav);
  };
  return (
    <div className="py-2 fixed w-full dark:bg-gray-800 dark:border-b-gray-600 border-b-gray-300 border-2 bg-white z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-0">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <Link to={"/"}>
            <div className="flex gap-2 items-center">
              <img src={logo} alt="" className="w-14 h-7 md:h-10 dark:invert" />
              <h1 className="font-bold text-3xl md:text-4xl">BlogAI</h1>
            </div>
          </Link>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" border border-gray-700 dark:bg-gray-900 bg-gray-300 w-[300px] hidden md:block"
            />
            <Button onClick={handleSearch} className="absolute right-0 top-0">
              <Search />
            </Button>
          </div>
        </div>
        {/* nav section */}
        <nav className=" flex md:gap-7 gap-4 items-center ">
          <ul className="hidden md:flex gap-7 items-center text-xl  font-semibold">
            <Link to={"/"}>
              {" "}
              <li>Home</li>
            </Link>
            <Link to={"/blogs"}>
              {" "}
              <li>Blogs</li>
            </Link>

            <Link to={"/about"}>
              {" "}
              <li>About</li>
            </Link>
          </ul>
          <div className="flex">
            <Button onClick={() => dispatch(toggleTheme())}>
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>
            {user ? (
              <div className="ml-7 flex gap-3 items-center">
                {/* <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar> */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={user.photoURL || userLogo} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/profile")}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/your-blog")}
                    >
                      Your Blogs
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/comments")}
                    >
                      Comments
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard/write-blog")}
                    >
                      Write Blog
                    </DropdownMenuItem>
                    <DropdownMenuItem>Log Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="hidden md:block" onClick={logoutHandler}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="ml-7 md:flex gap-2">
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
                <Link className="hidden md:block" to={"/signup"}>
                  <Button>SignUp</Button>
                </Link>
              </div>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          ) : (
            <HiMenuAlt1 onClick={toggleNav} className="w-7 h-7 md:hidden" />
          )}
        </nav>
        <ResponsiveMenu
          openNav={openNav}
          setOpenNav={setOpenNav}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Navbar;
