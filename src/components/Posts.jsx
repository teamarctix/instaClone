import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  // Ensure `posts` is not undefined before calling `.map()`
  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p>No posts available</p> // Show a fallback message if there are no posts
      )}
    </div>
  );
};

export default Posts;
