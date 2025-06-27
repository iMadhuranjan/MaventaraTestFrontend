"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/app/store/postSlice";   
import { useRouter } from "next/navigation";

export default function HomePage() {
  const dispatch  = useDispatch();
  const router    = useRouter();

   const { posts, loading } = useSelector((s) => s.posts);

   const [tag, setTag] = useState("");

   useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

   const shown = tag
    ? posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
      )
    : posts;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">All Blog Posts</h1>

      {/* search input */}
      <input
        className="mb-6 w-full rounded border p-2"
        placeholder="Filter by tag…"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      />

      {loading ? (
        <p>Loading…</p>
      ) : shown.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {shown.map((p) => (
            <li
              key={p._id}
              className="cursor-pointer rounded border p-4 shadow-sm hover:bg-gray-50"
              onClick={() => router.push(`/posts/${p._id}`, { target: "_blank" })}
            >
              <h2 className="text-lg font-bold">{p.title}</h2>
              {p.subTitle && (
                <p className="mt-1 text-sm text-gray-600">{p.subTitle}</p>
              )}
              <div className="mt-2 text-xs text-violet-700">
                {p.tags.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
