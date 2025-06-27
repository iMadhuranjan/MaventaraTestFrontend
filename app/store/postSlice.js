'use client'
import axios from "axios"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

const BACKEND_URL = "http://localhost:7777"

const initialState = {
    posts: [],
    post: null,
    loading: false,
    error: null
}

export const createPost = createAsyncThunk("posts/create", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/api/post`, data, { withCredentials: true })
        return res.data.post
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

export const updatePost = createAsyncThunk("posts/update", async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`${BACKEND_URL}/api/post/${id}`, data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

export const deletePost = createAsyncThunk("posts/delete", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${BACKEND_URL}/api/post/${id}`, { withCredentials: true })
        return id
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

export const getAllPosts = createAsyncThunk("posts/getAll", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/posts`, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

export const getPostById = createAsyncThunk("posts/getOne", async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/post/${id}`)
        return res.data
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

export const getPostsByTag = createAsyncThunk("posts/getTag", async (tag, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${BACKEND_URL}/api/post/tag/${tag}`)
        return res.data
    } catch (err) {
        return rejectWithValue(err?.response?.data?.message || "error")
    }
})

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: (builder) =>
        builder
            .addCase(createPost.pending, (s) => { s.loading = true })
            .addCase(createPost.fulfilled, (s, a) => { s.loading = false; s.posts.unshift(a.payload) })
            .addCase(createPost.rejected, (s, a) => { s.loading = false; s.error = a.payload })

            .addCase(updatePost.pending, (s) => { s.loading = true })
            .addCase(updatePost.fulfilled, (s, a) => {
                s.loading = false
                s.posts = s.posts.map(p => p._id === a.payload._id ? a.payload : p)
            })
            .addCase(updatePost.rejected, (s, a) => { s.loading = false; s.error = a.payload })

            .addCase(deletePost.pending, (s) => { s.loading = true })
            .addCase(deletePost.fulfilled, (s, a) => {
                s.loading = false
                s.posts = s.posts.filter(p => p._id !== a.payload)
            })
            .addCase(deletePost.rejected, (s, a) => { s.loading = false; s.error = a.payload })

            .addCase(getAllPosts.pending, (s) => { s.loading = true })
            .addCase(getAllPosts.fulfilled, (s, a) => { s.loading = false; s.posts = a.payload })
            .addCase(getAllPosts.rejected, (s, a) => { s.loading = false; s.error = a.payload })

            .addCase(getPostById.pending, (s) => { s.loading = true })
            .addCase(getPostById.fulfilled, (s, a) => { s.loading = false; s.post = a.payload })
            .addCase(getPostById.rejected, (s, a) => { s.loading = false; s.error = a.payload })

            .addCase(getPostsByTag.pending, (s) => { s.loading = true })
            .addCase(getPostsByTag.fulfilled, (s, a) => { s.loading = false; s.posts = a.payload })
            .addCase(getPostsByTag.rejected, (s, a) => { s.loading = false; s.error = a.payload })
})

export default postSlice.reducer
