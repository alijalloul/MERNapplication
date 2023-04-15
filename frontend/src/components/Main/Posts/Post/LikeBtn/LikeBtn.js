import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { likePost } from "../../../../../redux/Post.js";

import "./LikeBtn.css"
const LikeBtn = ({ userLiked, user, postInfoId}) => {
    const dispatch = useDispatch();
    const pendingLike = useSelector(state => state.post.pending).likePost;

    return(
        <button className="likeBtn" clicked={userLiked} disabled={ !user?.result || pendingLike } onClick={() => {likePost(postInfoId, dispatch)}}>
            <svg className="likeSVG" viewBox="-2.1 -2.1 25.20 25.20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="SVGRepo_bgCarrier"></g>
                <g id="SVGRepo_tracerCarrier" ></g>
                <g id="SVGRepo_iconCarrier"> 
                    <title>like [#1385]</title> 
                    <desc>Created with Sketch.</desc> 
                    <defs> </defs> 
                    <g id="Page-1"> 
                        <g id="Dribbble-Light-Preview" transform="translate(-259.000000, -760.000000)"> 
                            <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                <path d="M203,620 L207.200006,620 L207.200006,608 L203,608 L203,620 Z M223.924431,611.355 L222.100579,617.89 C221.799228,619.131 220.638976,620 219.302324,620 L209.300009,620 L209.300009,608.021 L211.104962,601.825 C211.274012,600.775 212.223214,600 213.339366,600 C214.587817,600 215.600019,600.964 215.600019,602.153 L215.600019,608 L221.126177,608 C222.97313,608 224.340232,609.641 223.924431,611.355 L223.924431,611.355 Z" id="like-[#1385]"> 
                                </path> 
                            </g> 
                        </g> 
                    </g> 
                </g>
            </svg>
        </button>
    )
};

export default LikeBtn;