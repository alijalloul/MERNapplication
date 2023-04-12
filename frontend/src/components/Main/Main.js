import React, { useState, useEffect } from 'react'
import { useDispatch } from "react-redux"

import Form from "./Form/Form.js"
import Posts from "./Posts/Posts.js"
import SearchBar from './SearchBar/SearchBar.js';
import Pagination from './Pagination/Pagination.js';

import "./Main.css";

const Main = () => {
    const [selectedPostId, setSelectedPostId] = useState(null);
    const dispatch = useDispatch();

  return (
    <main>
        <div className="main-container">
            <div className="main_left">
                <Posts setSelectedPostId={setSelectedPostId}/>
            </div>
            <div className="main_right_container">
                <div className="main_right">
                    <SearchBar />
                    <Form selectedPostId={selectedPostId} setSelectedPostId={setSelectedPostId}/>
                    <Pagination />
                </div>
            </div>
        </div>
    </main>
  )
}

export default Main