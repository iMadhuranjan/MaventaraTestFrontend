"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
} from "@/app/store/postSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { posts, loading } = useSelector((s) => s.posts);

  /* -------------------------------- state -------------------------------- */
  const [tab, setTab] = useState("list");   // "list" | "create"
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    tags: "",
    content: "",
  });

  /* --------------------------- fetch on mount --------------------------- */
  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  /* ---------------------------- helpers --------------------------------- */
  const resetForm = () => {
    setForm({ title: "", subTitle: "", tags: "", content: "" });
    setEditId(null);
    setTab("list");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()),
    };

    let res;
    if (editId) {
      res = await dispatch(updatePost({ id: editId, data: payload }));
    } else {
      res = await dispatch(createPost(payload));
    }

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(editId ? "Post updated" : "Post created");
      dispatch(getAllPosts());
      resetForm();
    } else {
      toast.error(res.payload || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deletePost(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Post deleted");
      dispatch(getAllPosts());
    } else {
      toast.error(res.payload || "Delete failed");
    }
  };

  const startEditing = (p) => {
    setForm({
      title: p.title,
      subTitle: p.subTitle || "",
      tags: p.tags.join(", "),
      content: p.content,
    });
    setEditId(p._id);
    setTab("create");
  };

  /* ------------------------------ JSX ----------------------------------- */
  return (
    <div className="flex min-h-screen">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="w-56 bg-gray-900 text-gray-100">
        <h2 className="border-b border-gray-700 p-4 text-xl font-bold">
          Dashboard
        </h2>
        <nav className="flex flex-col gap-0.5 p-2">
          <button
            onClick={() => setTab("list")}
            className={`rounded px-3 py-2 text-left hover:bg-gray-700 ${tab === "list" && "bg-gray-800"
              }`}
          >
            All Posts
          </button>
          <button
            onClick={() => {
              setEditId(null);
              setForm({ title: "", subTitle: "", tags: "", content: "" });
              setTab("create");
            }}
            className={`rounded px-3 py-2 text-left hover:bg-gray-700 ${tab === "create" && "bg-gray-800"
              }`}
          >
            {editId ? "Edit Post" : "Create Post"}
          </button>
        </nav>
      </aside>

      {/* ---------------- Main ---------------- */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {/* ---------- LIST ---------- */}
        {tab === "list" && (
          <>
            <h1 className="mb-4 text-2xl font-semibold">Your Posts</h1>
            {loading ? (
              <p>Loading…</p>
            ) : posts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <ul className="space-y-4">
                {posts.map((p) => (
                  <li
                    key={p._id}
                    className="rounded border p-4 shadow-sm flex justify-between items-start"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{p.title}</h3>
                      <p className="text-sm text-gray-600">{p.subTitle}</p>
                      <div className="mt-2 text-xs text-violet-700">
                        {p.tags.join(", ")}
                      </div>
                    </div>

                    {/* --- action buttons --- */}
                    <div className="space-x-2">
                      <Link
                      href={`/posts/${p._id}`}
                      target="_blank"
                        // onClick={() => router.push(`/posts/${p._id}`)}
                        className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      >
                        Show
                      </Link>
                      <button
                        onClick={() => startEditing(p)}
                        className="rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* ---------- CREATE / EDIT ---------- */}
        {tab === "create" && (
          <div className="max-w-xl">
            <h1 className="mb-4 text-2xl font-semibold">
              {editId ? "Edit Post" : "Create New Post"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["title", "subTitle", "tags", "content"].map((key) => (
                key !== "content" ? (
                  <input
                    key={key}
                    className="w-full rounded border p-2"
                    placeholder={key === "tags" ? "tags, comma, separated" : key}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                  />
                ) : (
                  <textarea
                    key={key}
                    className="h-40 w-full rounded border p-2"
                    placeholder="HTML content"
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                  />
                )
              ))}

              <button
                disabled={loading}
                className="rounded bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving…"
                  : editId
                    ? "Update Post"
                    : "Publish Post"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
