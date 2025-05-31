
import { setSuggestedUsers } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const usegetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/suggested", {withCredentials:true});
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.data.suggestedUser))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};

export default usegetSuggestedUsers;
