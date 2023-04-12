import React from "react";

import "./EditBtn.css";

const EditBtn = ({ setSelectedPostId, postInfoId}) => {
    return(
        <button className="editBtn" onClick={() => {setSelectedPostId(postInfoId)}}>
            <svg className="editSVG" viewBox="0 -0.5 21 21" version="1.1" fill="white">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier"> 
                    <title>edit_cover [#1481]</title> 
                    <desc>Created with Sketch.</desc> 
                    <defs> </defs> 
                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                        <g id="Dribbble-Light-Preview" transform="translate(-419.000000, -359.000000)" fill="white">
                            <g id="icons" transform="translate(56.000000, 160.000000)"> 
                                <path d="M384,209.210475 L384,219 L363,219 L363,199.42095 L373.5,199.42095 L373.5,201.378855 L365.1,201.378855 L365.1,217.042095 L381.9,217.042095 L381.9,209.210475 L384,209.210475 Z M370.35,209.51395 L378.7731,201.64513 L380.4048,203.643172 L371.88195,212.147332 L370.35,212.147332 L370.35,209.51395 Z M368.25,214.105237 L372.7818,214.105237 L383.18415,203.64513 L378.8298,199 L368.25,208.687714 L368.25,214.105237 Z" id="edit_cover-[#1481]"> 
                                </path> 
                            </g>
                        </g> 
                    </g> 
                </g>
            </svg>
        </button>
    )
};

export default EditBtn;