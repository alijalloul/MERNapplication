import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"

import ChipInput from '../../ChipInput/ChipInput.js';
import { fetchPostsBySearch } from '../../../redux/Post.js';

import "./SearchBar.css";

function useQuery(){
    return new URLSearchParams(useLocation().search);
}
const SearchBar = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get("page") || 1;
    const searchQuery = query.get("searchQuery");

    const [searchText, setSearchText] = useState('');
    const [searchTag, setSearchTag] = useState({
        searchTags: []
    })

    const handleKeyDown = (e) => {
        if(e.keyCode === 13){
            searchPost();
        }
    }

    const searchPost = () => {
        if(searchText.trim() || searchTag.searchTags.length){
            fetchPostsBySearch({ search: searchText, tags: searchTag.searchTags.join(',') }, page, dispatch);
            navigate(`/posts/search?searchQuery=${searchText || "none"}&tags=${searchTag.searchTags.join(",")}`)
        }else{
            navigate("/");
        }
    }
    return (
        <div className="searchbar_container">
            <h1 className='searchbar_header'>Search</h1>
            <input className="searchbar_input_text" type="text" placeholder="Search" onKeyDown={ handleKeyDown } onChange={e => setSearchText(e.target.value)}/>
            <ChipInput chipArray={searchTag} setChipArray={setSearchTag} chips={"searchTags"} placeholder="Tags" submitKey="Enter" submitFunction={ handleKeyDown } />
            <button onClick={ searchPost } className='searchbar_input_btn'>Search</button>
        </div>
    )
}

export default SearchBar