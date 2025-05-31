import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { selectedPost, setPosts } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const { user } = useSelector((store) => store.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [comment, setComment] = useState(post.comments);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/post/${post._id}/liketoggle`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setPostLike((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
        setLiked((prevLiked) => !prevLiked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const commentHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedCommetData = [...comment, response.data.data.comment];
        setComment(updatedCommetData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommetData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };


  const bookmarkHandler = async () => {
    try {
    const res = await axios.get(`http://localhost:3000/api/v1/post/${post?._id}/bookmark`,{withCredentials: true})
    if (res.data.success) {
      toast.success(res.data.message)
    }
    } catch (error) {
      
    }
  }


  const isAuthor = user?._id === post?.author._id;

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="postImage" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post?.author.username}</h1>
            {user?._id == post.author._id && <Badge variant="secondary">Author</Badge> }
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {
              post?.author._id !== user?._id && <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold">
              Unfollow
            </Button>
            }
            
            <Button variant="ghost" className="cursor-pointer w-fit font-bold">
              Add to favourites
            </Button>
            {isAuthor && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="postImage"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex gap-3 items-center">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-500"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={likeOrDislikeHandler}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(selectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium mb-2 block">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(selectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400">
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment......"
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#38ADF8] cursor-pointer">
            Post
          </span>
        )}
      </div>
    </div>
  );
};
export default Post;
