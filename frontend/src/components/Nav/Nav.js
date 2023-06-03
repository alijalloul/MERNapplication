import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import decode from "jwt-decode";

import { logout } from "../../redux/User.js"

import image from "../../img/rec.jpeg";
import "./Nav.css";

const Nav = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [ user, setUser ] = useState((typeof window !== 'undefined') && JSON.parse(localStorage.getItem('profile')));

    useEffect(() => {
        const token = user?.token;
        if(token){
            const decodedToken = decode(token);

            if(decodedToken.exp * 1000 < new Date().getTime()) logout(navigate, dispatch);
        }

        setUser(JSON.parse((typeof window !== 'undefined') && localStorage.getItem("profile")));
    },[location]);

    const handleLogout = () => {
        logout(navigate, dispatch);
        setUser(null);
    }

    return (
        <>
            <nav>
                <Link to="/"><img className="header_img" src={image} alt="N/A"/></Link>
                <div>
                    {
                        user ?  (<div className="userProfileLogout">
                                    <img src={user?.result?.picture} alt={user?.result?.name} /> 
                                    <button onClick={ handleLogout }>Logout</button>
                                </div>): 
                                (<Link to="/auth"><button className="signInBtn">Sign In</button></Link>) 
                    }
                </div>
            </nav>
        </>
    )
}

export default Nav