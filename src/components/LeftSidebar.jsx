import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { setLikeNotification } from "@/redux/rtnSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout."
      );
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Messages":
        navigate("/chat");
        break;
      default:
        break;
    }
  };

  const renderNotificationPopover = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">
            {likeNotification?.length}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white shadow-lg rounded-lg p-4 w-60">
          <h3 className="font-semibold text-lg mb-2">Notifications</h3>
          {likeNotification?.length === 0 ? (
            <p className="text-gray-500">No New Notifications</p>
          ) : (
            <div className="flex flex-col">
              {likeNotification.map((notification) => (
                <div
                  key={notification.userId}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={notification.userDetails?.profilePicture}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-bold">
                      {notification.userDetails?.username}
                    </span>
                    <span> liked your post</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications", hasNotifications: true },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex-col flex">
        <h1 className="my-8 pl-3 font-bold text-xl">Instagram</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 my-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3">
              {item.icon}
              <span>{item.text}</span>
              {item.text === "Notifications" &&
                likeNotification?.length > 0 &&
                renderNotificationPopover()}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
