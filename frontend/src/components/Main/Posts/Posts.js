import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 

import Post from "./Post/Post.js"
import Loader from "../../Loader/Loader.js";
import "./Posts.css";

const Posts = ( { setSelectedPostId } ) => {
    const stateInfo = useSelector((state) => state.post.postsInfo);
    const pending = useSelector(state => state.post.pending);
    const load = Object.keys(pending)
        .filter(key => key !== "likePost")
        .map(key => pending[key])
        .some(pend => pend === true);
    const [posts, setposts] = useState([]);    
    
    useEffect(() => {
        setposts(stateInfo);
    }, [ stateInfo ]);

    if(stateInfo?.length === 0){
        return <h1>Be the first to post!</h1>
    }

    return(
        load ? <Loader /> :(
            <div className="posts_container">
                {
                    posts.map( (post) => (
                        <div className="post_container" key={[post._id]}>
                            <Post postInfo={post} setSelectedPostId={setSelectedPostId}/>
                        </div>
                    ))
                }
            </div>
        )
    );
}

export default Posts;