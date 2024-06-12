import React, { useEffect } from "react";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../Loader/Loader.js";
import Comments from "./Comments/Comments.js";
import { fetchPostById, fetchPostsBySearch } from "../../redux/Post.js";

import postImage from "../../public/img/empty.jpg";

import "./PostDetails.css";

const PostDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const query = useQuery();
  const page = query.get("page") || 1;

  const postInfo = useSelector((state) => state.post.postInfoById);
  const postsInfo = useSelector((state) => state.post.postsInfo);
  const pending = useSelector((state) => state.post.pending);
  const load = Object.keys(pending)
    .filter((key) => key !== "postComment")
    .map((key) => pending[key])
    .some((pend) => pend === true);

  const { id } = useParams();

  useEffect(() => {
    if (id !== null) {
      fetchPostById(id, dispatch);
    }
  }, [id]);

  useEffect(() => {
    if (postInfo !== null) {
      fetchPostsBySearch(
        { search: null, tags: postInfo?.tags?.join(",") },
        page,
        dispatch
      );
    }
  }, [postInfo]);

  const recommendedPosts = postsInfo.filter(({ _id }) => _id !== postInfo?._id);

  if (!postInfo) {
    return null;
  }

  const handleImageClick = (id) => {
    navigate(`/posts/${id}`);
  };

  return load ? (
    <Loader />
  ) : (
    <div className="post_details_container">
      <div className="post_details">
        <div className="top_post_details_container">
          <div className="left_post_details_container">
            <span className="title">{postInfo.title}</span>
            <span className="tags">
              {postInfo.tags.map((tag) => `#${tag} `)}
            </span>
            <span className="discreption">{postInfo.message}</span>
            <span className="creatorName">Created By: {postInfo.name}</span>
            <span className="createdAt">
              {moment(postInfo.createdAt).fromNow()}
            </span>
            <Comments post={postInfo} />
          </div>

          <div className="right_post_details_container">
            <div className="post_details_image_container">
              <img
                src={
                  postInfo.file == null
                    ? postImage
                    : !postInfo.file
                    ? postImage
                    : postInfo.file
                }
                alt="N/A"
              />
            </div>
          </div>
        </div>
        {recommendedPosts?.length > 0 && (
          <div className="bottom_post_details_container">
            <h1 className="YMAL">You might also like:</h1>

            <div className="bottom_posts_details">
              {recommendedPosts.map((post) => (
                <div className="bottom_post_details" key={post._id}>
                  <span className="recommendedPost_title">{post.title}</span>
                  <span className="recommendedPost_name">
                    Created By: {post.name}
                  </span>
                  <span className="recommendedPost_message">
                    {post.message}
                  </span>
                  <span className="recommendedPost_likes">
                    Likes: {post.likes.length}
                  </span>
                  <div className="recommendedPost_image_container">
                    <img
                      src={
                        post.file == null
                          ? postImage
                          : !post.file
                          ? postImage
                          : post.file
                      }
                      alt="N/A"
                      onClick={() => handleImageClick(post._id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
