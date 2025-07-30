"use client";
import React from "react";
import Image from "next/image";

interface PostProps {
  post: {
    _id: string;
    imagePath: string;
    caption: string;
    createdAt: string;
    userId: {
      _id: string;
      username: string;
      profilePic?: string;
    };
    likes: string[];
    comments: Array<{
      _id: string;
      text: string;
      userId: {
        _id: string;
        username: string;
      };
      createdAt: string;
    }>;
  };
}

export default function Post({ post }: PostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
          {post.userId.profilePic ? (
            <Image
              src={post.userId.profilePic}
              alt={post.userId.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <span className="text-white font-semibold">
              {post.userId.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-white">{post.userId.username}</p>
          <p className="text-gray-400 text-sm">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Caption */}
        <div className="mb-3">
          <span className="text-white">Caption: {post.caption}</span>
        </div>

      {/* Post Image */}
      <div className="relative w-full">
        <Image
          src={post.imagePath}
          alt="Post image"
          width={600}
          height={600}
          className="w-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button className="text-white hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="text-white hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Likes */}
        {post.likes.length > 0 && (
          <p className="text-white font-semibold mb-2">
            {post.likes.length} like{post.likes.length !== 1 ? "s" : ""}
          </p>
        )}

        

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-2">
            {post.comments.slice(0, 3).map((comment) => (
              <div key={comment._id} className="flex">
                <span className="font-semibold text-white mr-2">{comment.userId.username}</span>
                <span className="text-white">{comment.text}</span>
              </div>
            ))}
            {post.comments.length > 3 && (
              <p className="text-gray-400 text-sm">
                View all {post.comments.length} comments
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 