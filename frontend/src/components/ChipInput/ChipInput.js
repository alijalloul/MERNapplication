import React from 'react'

import "./ChipInput.css";

const ChipInput = ({ chipArray, setChipArray, chips, placeholder, submitKey, submitFunction, onChange, name }) => {
    const handleKeyDown = (e) => {
        if(e.key === " " || e.code === "Space"){
            if(e.target.value.trim() !== ""){
                setChipArray({ ...chipArray, [chips]: [...chipArray[chips], e.target.value.trim()], });
                e.target.value="";
            }
        }else if(e.code === "Backspace" && e.target.value === "" && chipArray[chips].length > 0){
            setChipArray({ ...chipArray, [chips]: chipArray[chips].slice(0, -1) })
        }

        if(e.code === submitKey){
            submitFunction(e);
        }
    }

    const handleRemoveChip = (e, indexToRemove) => {
        e.preventDefault();

        setChipArray({ ...chipArray, [chips]: chipArray[chips].filter((_, index) => index !== indexToRemove)});
    }

    return (
        <div className="chips_container">
            {
                (chipArray[chips].length > 0) && (
                    chipArray[chips].map((chip, index) => (
                        <div className="chip_container" key={index}>
                            <div className="chip">
                                <h1 className="chipText">{chip}</h1>
                                <button className="removeChipBtn" onClick={ (e) => handleRemoveChip(e, index) }>✕</button>
                            </div>
                        </div>
                    ))
                )
            }
            <input 
                className="chipsInput" 
                name={ name }
                type="text" 
                placeholder={ placeholder } 
                onKeyDown={ (e) => handleKeyDown(e) }
                onChange={ onChange }
            />
        </div>
    )
}

export default ChipInput