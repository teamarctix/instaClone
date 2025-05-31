import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);

  const [isFollowing, setIsFollowing] = useState(
    userProfile?.followers?.includes(user?._id)
  );
  console.log(userProfile?.followers?.includes(user?._id));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const handleFollowUnfollow = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/followorunfollow/${userProfile?._id}`,
        { withCredentials: true }
      );
      
      const updatedUserProfile = {
        ...userProfile,
        followers: isFollowing 
          ? userProfile.followers.filter(followerId => followerId !== user._id) 
          : [...userProfile.followers, user._id]
      };
      dispatch(setUserProfile(updatedUserProfile));
      setIsFollowing(!isFollowing);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error occurred while following/unfollowing:", error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = userProfile?.posts || [];

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex justify-center items-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>
                {userProfile?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className={`h-8 ${
                      isFollowing ? "bg-red-500" : "bg-[#0095f6]"
                    } hover:bg-[#3192d2]`}
                    onClick={handleFollowUnfollow}
                    disabled={loading}>
                    {loading ? (
                      <Loader className="animate-spin" />
                    ) : isFollowing ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  Post
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio here ..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>Welcome to My Project</span>
                <span>Thank You for watching</span>
                <span>A instaclone project</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center text-sm justify-center gap-10">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}>
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}>
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  loading="lazy"
                  alt="postImage"
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
