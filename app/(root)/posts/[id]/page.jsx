"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";

const BACKEND_URL = "http://localhost:7777";

export default function SinglePostPage() {
  const { id } = useParams();


  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        toast.error("Failed to fetch post");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!post) return <p className="p-6">Post not found.</p>;

  return (
    <>
      <article className="mx-auto max-w-2xl p-6">
        <h1 className="mb-2 text-3xl font-bold">{post.title}</h1>
        {post.subTitle && (
          <h2 className="mb-6 text-xl text-gray-600">{post.subTitle}</h2>
        )}
        <div className="mb-4 text-sm text-violet-700">
          {post.tags?.join(", ")}
        </div>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />


      </article>
      <div className="mx-auto max-w-2xl p-6">
        <Link href={'/'} className="font-extrabold text-md text-blue-500 my-24 ">Back to Home</Link></div></>
  );
}
