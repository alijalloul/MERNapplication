import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { postComment } from '../../../redux/Post.js';

import "./Comments.css";

const Comments = ({ post }) => {
    const dispatch = useDispatch();
    const [comments, setComments] = useState(post?.comments); 
    const [comment, setComment] = useState(""); 
    const user = JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile"));

    const loadComment = useSelector(state => state.post.pending.postComment);

    const handleClick = async () => {        
        const finalComment = `${user?.result?.name}: ${comment}`;
        const newComments = await postComment(finalComment, post._id, dispatch);
        setComments(newComments);
        setComment("");
    }
    
    return (
        <div className="comments_container">
            {
                user?.token ? (
                    <>
                        <div className='comments_left_container'>
                        <h3>Comments: </h3>
                        {
                            comments.length > 0 && (
                                comments?.slice(0).reverse().map((comment, i) => (
                                    <div key={i} style={{display : "flex"}}>
                                        <h1 className="comment" style={{color: "rgb(130,130,130)", marginRight: "4px"}}>{comment.split(":")[0]}:</h1>
                                        <h1 className="comment" >{comment.split(":")[1]}</h1>
                                    </div>
                                ))
                            )
                        }
                        </div>

                        <div className="comments_right_container">
                            <textarea className="comment_textarea" value={comment} onChange={e => {setComment(e.target.value)}}></textarea>
                            <button disabled={ loadComment } className="submit_comment_btn" onClick={handleClick}>Comment</button>
                        </div>
                    </>
                    ) : (
                    <div className="loginPrompt">
                        <h1>Please Login in order to post a memory and like other memories</h1>
                    </div>
                )
            }
        </div>
    )
}

export default Comments