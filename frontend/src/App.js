import React from "react";
import { Routes, Route, Navigate, useLocation  } from "react-router-dom";

import Nav from "./components/Nav/Nav.js";
import Main from "./components/Main/Main.js";
import Auth from "./components/Auth/Auth.js";
import PostDetails from "./components/PostDetails/PostDetails.js"

import "./App.css";

const App = () => {
    const location = useLocation();

    return (
        <>
            <div className="container">
                <Nav />
                <Routes location={location} key={location.pathname}> 
                    <Route path="/" element={ <Navigate to="/posts"/> } />
                    <Route path="/posts" element={<Main />}/>
                    <Route path="/posts/search" element={<Main />}/>
                    <Route path="/posts/:id" element={<PostDetails />}/>
                    <Route path="/auth" element={<Auth />}/>
                </Routes>
            </div>
        </>
    );
}

export default App;