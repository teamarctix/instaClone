import React, { useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  const messagesEndRef = useRef(null);
  const { messages, loading, error } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  useGetAllMessage();
  useGetRTM();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {loading && (
        <div className="text-center text-gray-500">
          Loading messages...
        </div>
      )}

      {/* Handle error state */}
      {error && (
        <div className="text-center text-red-500">
          Failed to load messages. Please try again later.
        </div>
      )}

      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Display empty state if there are no messages */}
      {!messages?.length && !loading && (
        <div className="text-gray-500 text-center mt-4">
          No messages yet.
        </div>
      )}

      {/* Messages list */}
      <div className="flex flex-col gap-3">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs sm:max-w-md break-words ${
                msg.senderId === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        {/* Scroll-to-bottom anchor */}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

export default Messages;
