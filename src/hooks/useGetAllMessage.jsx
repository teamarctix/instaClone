import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        console.log(selectedUser?._id);
        const res = await axios.post(
          `http://localhost:3000/api/v1/message/all/${selectedUser?._id}`,{},
          { withCredentials: true }
        );
        console.log(res);
        if (res.data.success) {
          dispatch(setMessages(res.data.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  },[selectedUser]);
};

export default useGetAllMessage;
