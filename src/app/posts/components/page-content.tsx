"use client";

import usePosts from "../hooks/use-posts";

export default function PageContent() {
  const { posts } = usePosts();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <ul className="space-y-4">
        {posts?.posts.map((post) => (
          <li key={post.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
