import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"

import LikeBtn from "./LikeBtn/LikeBtn.js";
import DeleteBtn from "./DeleteBtn/DeleteBtn.js";
import EditBtn from "./EditBtn/EditBtn.js";

import postImage from "../../../../img/empty.jpg";
import "./Post.css";

const Post = ({postInfo, setSelectedPostId}) => {
    const navigate = useNavigate();
    const userInfo = useSelector( state => state).user;
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('profile')));
    const userLiked = postInfo.likes.find(like => like === (user?.result?.sub || user?.result?._id)) 
        ? (   
            "true"
        ):(
         "false"
        )
  
    const Likes = () => {
        if(postInfo.likes.length > 0){
            return (
                userLiked==="true"
                ?(   
                    <h5 className="likesnb">{ postInfo.likes.length > 2 ? `You and ${ postInfo.likes.length - 1 } others` : `${postInfo.likes.length} like${postInfo.likes.length > 1 ? "s" : ""}` }</h5>
                ):(
                    <h5 className="likesnb">{ postInfo.likes.length } { postInfo.likes.length === 1 ? "Like" : "Likes" }</h5>
                )
            )
        }

        return <h5 className="likesnb">Like</h5>
    }

    useEffect(() => {
        if(!(userInfo?.userInfo)){
            setUser(null);
        }
    },[userInfo]);

    const handleClickPost = (e) => {
        e.preventDefault();

        navigate(`/posts/${postInfo._id}`);
    }

    
    return(
        <div className="post">
            <div className="post_top_container" onClick={ handleClickPost }>
                <div className="post_image_container">
                    <img src={(postInfo.file == null ) ? postImage : ( (!postInfo.file) ? postImage : postInfo.file)} alt="N/A" />
                </div>
        
                <div className="post_top">
                    <div className="post_top_left">
                        <h2 className="post_name">{postInfo.name}</h2>
                        <h3 className="post_date">{moment(postInfo.createdAt).fromNow()}</h3>
                    </div>

                    <div className="edit">
                        { 
                            ((user?.result?.sub === postInfo?.creatorID || user?.result?._id === postInfo?.creatorID) && (user?.result)) ? (
                               <EditBtn setSelectedPostId={setSelectedPostId} postInfoId={postInfo._id}/>
                            ) : (
                                null
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="post_bottom">
                <h4 className="post_tags">{postInfo.tags.map(tag => `#${tag} `)}</h4>
                <div className="post_bottom_text">    
                    <h1 className="post_title">{postInfo.title}</h1>
                    <h2 className="post_message">{postInfo.message}</h2>
                </div>

                <div className="post_bottom_btns">
                    <div className="like">                        
                        <LikeBtn userLiked={userLiked} user={user} postInfoId={postInfo._id} />
                        <Likes className="likeDisc"/>
                    </div>
                    <div className="delete">
                        { 
                            ((user?.result?.sub === postInfo?.creatorID || user?.result?._id === postInfo?.creatorID) && (user?.result)) ? (
                                <DeleteBtn postInfoId={postInfo._id}/>
                            ) : (
                                <DeleteBtn postInfoId={postInfo._id}/>
                            )
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Post;