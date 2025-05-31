import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser, setSuggestedUsers } from "@/redux/authSlice";
import { setPosts } from "@/redux/postSlice";
import { setSocket } from "@/redux/socketSlice";
import { setOnlineUsers } from "@/redux/chatSlice";
import { setLikeNotification } from "@/redux/rtnSlice";

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.data.user))
        // dispatch(setSocket(null))
        // dispatch(setLikeNotification([]))
        // dispatch(setOnlineUsers([]))
        // dispatch(setPosts([])) add this if any fucked up happend in redux
        // dispatch(setSuggestedUsers([])) 
        navigate("/")
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setInput({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8">
        <div className="my-4">
          <h1 className="text-center flex flex-col text-1xl font-bold">LOGIN</h1>
          <p className="text-center text-sm">
            Login to see photos and videos
          </p>
        </div>
        <div>
          <label className="font-medium">Email</label>
          <Input
            type="text"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <label className="font-medium">Password</label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="my-2 focus-visible:ring-transparent"
          />
        </div>
        {
            loading ? (
                <Button>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Please wait
                </Button>
            ) : (
                <Button type="submit">Log In</Button>
            )
        }
        
        <span className="text-center">Don't have an account? <Link to= '/signup' className="text-blue-600">SignUp</Link></span>
      </form>
    </div>
  );
}

export default Login;
