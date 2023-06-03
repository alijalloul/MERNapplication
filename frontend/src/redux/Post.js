import { createSlice } from "@reduxjs/toolkit";

const baseURL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

const postSlice = createSlice({
    name: "posts",
    initialState: {
        postInfoById: null,
        postsInfo: [],
        currentPage: 1,
        numberOfPages: null,
        pending: {},
        error: false
    },
    reducers: {
        startAPI: (state, action) => {
            state.pending = {...state.pending, [action.payload]: true};
            console.log(state.pending);
        },
        fetchPostByIdSuccess: (state, action) => {
            state.pending = {...state.pending, fetchPostById: false};
            state.postInfoById = action.payload;
        },
        fetchSuccess: (state, action) => {
            state.pending = {...state.pending, fetchPosts: false};
            state.postsInfo = action.payload.data;
            state.currentPage = action.payload.currentPage;
            state.numberOfPages = action.payload.numberOfPages;
        },
        fetchBySearchSuccess: (state, action) => {
            state.pending = {...state.pending, fetchPostsBySearch: false};
            state.postsInfo = action.payload.data;
            state.currentPage = action.payload.currentPage;
            state.numberOfPages = action.payload.numberOfPages;
        },
        createSuccess: (state, action) => {
            state.pending = {...state.pending, createPost: false};
            state.postsInfo.push(action.payload);
        },
        updateSuccess: (state, action) => {
            state.pending = {...state.pending, updatePost: false};
            Object.assign(state.postsInfo.filter(post => post._id === action.payload._id)[0], action.payload);
        },
        likesSuccess: (state, action) => {
            state.pending = {...state.pending, likePost: false};
            state.postsInfo.filter(post => post._id === action.payload._id)[0].likes = action.payload.data;
        },
        deleteSuccess: (state, action) => {
            state.pending = {...state.pending, deletePost: false};
            state.postsInfo = state.postsInfo.filter(post => post._id !== action.payload);
        },
        commentSuccess: (state, action) => {
            state.pending = {...state.pending, postComment: false};
            state.postsInfo.filter(post => post._id === action.payload._id)[0].comments = action.payload.data;
        },
        errorAPI: (state, action) => {
            state.pending = {...state.pending, [action.payload]: null};
            state.error = true;
        },
    }
});

export const fetchPostById = async (postId, dispatch) => {
    dispatch(postSlice.actions.startAPI("fetchPostById"));

    try {
        
        const res = await fetch(`${baseURL}/posts/${postId}`);
        const data = await res.json();

        dispatch(postSlice.actions.fetchPostByIdSuccess(data))
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}

export const fetchPosts = async (page, dispatch) => {
    dispatch(postSlice.actions.startAPI("fetchPosts"));

    try {
        
        const res = await fetch(`${baseURL}/posts?page=${page}`);

        const data = await res.json();

        dispatch(postSlice.actions.fetchSuccess(data))
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}

export const fetchPostsBySearch = async (searchQuery, page, dispatch) => {
    dispatch(postSlice.actions.startAPI("fetchPostsBySearch"));

    try {
        
        const res = await fetch(`${baseURL}/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${searchQuery.tags}&page=${page}`, {
            mode: 'cors'
        });
        const data = await res.json();

        dispatch(postSlice.actions.fetchBySearchSuccess(data))
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}

export const createPost = async (postsInfo, navigate, dispatch) => {
    dispatch(postSlice.actions.startAPI("createPost"));

    try {
        
        const res = await fetch(`${baseURL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")).token}`
            },
            body: JSON.stringify(postsInfo)
        });

        const data = await res.json();

        navigate(data._id)
        dispatch(postSlice.actions.createSuccess(data));
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}
export const updatePost = async (selectedPostId, postsInfo, dispatch) => {
    dispatch(postSlice.actions.startAPI("updatePost"));
    
    try {    
        
        const res = await fetch(`${baseURL}/${selectedPostId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")).token}`
            },
            body: JSON.stringify(postsInfo)
        });

        const data = await res.json();
        dispatch(postSlice.actions.updateSuccess(postsInfo));
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}
export const deletePost = async (selectedPostId, dispatch) => {
    dispatch(postSlice.actions.startAPI("deletePost"));

    try {
        await fetch(`${baseURL}/${selectedPostId}`, {
            method: "DELETE",
            "authorization": `Bearer ${JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")).token}`
        });    
        dispatch(postSlice.actions.deleteSuccess(selectedPostId));
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}
export const likePost = async (selectedPostId, dispatch) => {
    dispatch(postSlice.actions.startAPI("likePost"));
    
    try {
        
        const res = await fetch(`${baseURL}/${selectedPostId}/likePost`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")).token}`
            }
        });

        const data = await res.json();

        dispatch(postSlice.actions.likesSuccess({ _id: selectedPostId, data: data }));
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}

export const postComment = async (commentInfo, selectedPostId, dispatch) => {
    dispatch(postSlice.actions.startAPI("postComment"));

    try {
        const res = await fetch(`${baseURL}/${selectedPostId}/postComment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")).token}`
            },
            body: JSON.stringify({commentInfo})
        });

        const data = await res.json();

        dispatch(postSlice.actions.commentSuccess({data: data, _id: selectedPostId}));

        return data;
    } catch (error) {
        dispatch(postSlice.actions.errorAPI());
        console.log("error: ", error);
    }
}

export default postSlice.reducer;