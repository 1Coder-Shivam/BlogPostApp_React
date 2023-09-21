import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';



const initialState =  {
    posts: [],
    status: 'idle',
    error: null,
    categories: ["Sport", "Technology", "Film", "Politics", "Others"],
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        // Fetch posts from local state instead of an API
        return initialState.posts;
    } catch (error) {
        return error.message;
    }
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    // Simulate adding a new post locally
    const newPost = {
        ...initialPost,
        id: nanoid(),
        date: new Date().toISOString(),
        reactions: {
            thumbsUp: 0,
            heart: 0,
        },
    };
    return newPost;
});


export const updatePost = createAsyncThunk('posts/updatePost', async (updatedPost, { getState }) => {
    const { id, reactions, ...rest } = updatedPost;
    const state = getState();
    const existingPost = state.posts.posts.find((post) => post.id === id);

    if (existingPost) {
        const updatedReactions = {
            ...existingPost.reactions,
            ...(reactions || {}),
        };

        const updatedPostData = {
            ...rest,
            id,
            reactions: updatedReactions,
        };

        return updatedPostData;
    }

    throw new Error(`Post with ID ${id} not found`);
});



export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    // Simulate deleting a post locally
    const { id } = initialPost;

    return { id };
});


const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        
        postAdded: {
            reducer(state, action) {
              state.posts.push(action.payload);
            },
            prepare(title, content, userId, category) {
              return {
                payload: {
                  id: nanoid(),
                  title,
                  content,
                  date: new Date().toISOString(),
                  category, // Include the category
                  reactions: {
                    thumbsUp: 0,
                    heart: 0,
                  },
                },
              };
            },
          },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        heart: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
              })
              .addCase(updatePost.fulfilled, (state, action) => {
                const { id } = action.payload;
                const postIndex = state.posts.findIndex((post) => post.id === id);
                if (postIndex !== -1) {
                  state.posts[postIndex] = action.payload;
                }
              })
              .addCase(deletePost.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.posts = state.posts.filter((post) => post.id !== id);
              })
              
            
            
    }
})

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer