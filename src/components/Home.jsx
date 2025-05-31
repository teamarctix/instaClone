import React from "react";
import Feed from "./Feed";
import Outlet from "./Outlet";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import usegetSuggestedUsers from "@/hooks/useGetSuggestedUser";
import Profile from "./Profile";


function Home() {
  useGetAllPost()
  usegetSuggestedUsers()
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
}

export default Home;
