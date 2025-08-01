"use client";
import React from "react";
import Image from "next/image";

interface PostProps {
  post: {
    _id: string;
    mediaPath: string;
    mediaType: 'image' | 'video';
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
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-3xl border border-[#333] shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform ">
      {/* Post Header */}
      <div className="flex items-center p-6 border-b border-[#333]">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4 ring-2 ring-[#333]">
          {post.userId.profilePic ? (
            <Image
              src={post.userId.profilePic}
              alt={post.userId.username}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {post.userId.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-lg">{post.userId.username}</p>
          <p className="text-gray-400 text-sm">{formatDate(post.createdAt)}</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-6 py-4">
          <p className="text-white text-lg leading-relaxed">{post.caption}</p>
        </div>
      )}

      {/* Post Media */}
      {post.mediaPath && post.mediaPath.trim() !== "" && (
        <div className="relative w-full">
          {post.mediaType === 'video' ? (
            <video
              src={post.mediaPath}
              controls
              className="w-full object-cover"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={post.mediaPath}
              alt="Post image"
              width={600}
              height={600}
              className="w-full object-cover"
              priority={false}
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200 group">
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-medium">Like</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors duration-200 group">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-medium">Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <span className="font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Likes Count */}
        {post.likes.length > 0 && (
          <div className="mb-4">
            <p className="text-white font-semibold">
              {post.likes.length} like{post.likes.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-3 border-t border-[#333] pt-4">
            {post.comments.slice(0, 3).map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {comment.userId.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 bg-[#262626] rounded-2xl px-4 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-white text-sm">{comment.userId.username}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-white text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
            {post.comments.length > 3 && (
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                View all {post.comments.length} comments
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 