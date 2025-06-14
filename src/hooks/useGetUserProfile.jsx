import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
//   const [userProfile, setUserProfile] = useState(null)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/user/${userId}/profile`, {withCredentials:true});
        if (res.data.success) {
          dispatch(setUserProfile(res.data.data.user))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
