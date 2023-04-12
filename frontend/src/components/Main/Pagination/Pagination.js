import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';

import { fetchPosts, fetchPostsBySearch } from '../../../redux/Post.js';

import "./Pagination.css";

const Pagination = () => {
    const dispatch = useDispatch();
    const numberOfPages = useSelector(state => state.post.numberOfPages);
    function useQuery(){
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get("page") || 1;
    const searchQuery = query.get("searchQuery");
    const tags = query.get("tags");

    useEffect(() => {
        if(searchQuery === null && tags === null){
            fetchPosts(page, dispatch);
        }else{
            fetchPostsBySearch({ search: searchQuery, tags: tags }, page, dispatch);
        }
        
    },[page]);

    

    const checkPageSelected = (btnPage) => {
        if(btnPage === Number(page)){
            return "true";
        }

        return "false";
    }
    const handleClick = (e, newPage) => {
        e.preventDefault();

        navigate(`/posts?page=${newPage}`);
    }
  return (
    <div className="pagination_container">
        <button className="left_page_btn" onClick={() => { (Number(page) > 1) && navigate(`/posts?page=${Number(page) - 1}`) }}>&lt;</button>
        <div className="page_btns_container">
            {(() => {
                    const btns = [];
                    for(let i = 1; i <= numberOfPages; i++){ 
                        btns.push(<button key={i} className="page_btn" active={checkPageSelected(i)} onClick={ (e) => handleClick(e, i) }>{i}</button>);
                    }
                    return btns;
                })()    
            }
        </div>
        <button className="right_page_btn" onClick={() => { (Number(page) < numberOfPages) && navigate(`/posts?page=${Number(page) + 1}`) }}>&gt;</button>
    </div>
  )
}

export default Pagination