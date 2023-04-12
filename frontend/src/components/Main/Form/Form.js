import React ,{useState, useEffect} from "react";
import { useDispatch, useSelector} from "react-redux";

import { createPost, updatePost } from "../../../redux/Post.js";
import "./Form.css";

import ChipInput from "../../ChipInput/ChipInput.js";
import { useNavigate } from "react-router-dom";

const Form = ({ selectedPostId, setSelectedPostId }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const post = useSelector( state => selectedPostId ? state.post.postsInfo.find( p => p._id === selectedPostId) : null);
    const userInfo = useSelector( state => state).user;
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('profile')));
    const [postsInfo, setpostsInfo] = useState({
        title: "",
        message: "",
        tags: [],
        file: "",
        likes: [],
        createdAt: new Date(),
        creatorID: ""
        });

    const[postFormErrors, setPostFormErrors] = useState({
        titleError: "",
        messageError: "",
        tagsError: ""
    });


    useEffect(() => {
        if(post){
            setpostsInfo(post);
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;

        const fieldsToValidate = ['title', 'message'];
        fieldsToValidate.forEach((field) => {
            if (postsInfo[field].trim() === "") {
                hasError = true;
                setPostFormErrors((prevFormErrors) => ({...prevFormErrors, [`${field}Error`]: `${field} is required`}));
            }
        });

        if (postsInfo.tags.length === 0) {
            hasError = true;
            setPostFormErrors((prevFormErrors) => ({...prevFormErrors, tagsError: "a tag is required"}));
        }

        console.log(postFormErrors);

        if(!hasError){
            const userID = user?.result?.sub || user?.result._id;
            setpostsInfo({ ...postsInfo, createdAt: new Date() });
    
            if(selectedPostId){
                updatePost(selectedPostId, { ...postsInfo, name: user?.result?.name, creatorID: userID }, dispatch);
            }else{
                createPost({ ...postsInfo, name: user?.result?.name, creatorID: userID }, navigate, dispatch);
            }
    
            clear();
        }
    }
    const handleChange = (e) => {
        setpostsInfo({ ...postsInfo, [e.target.name]: e.target.value});
        setPostFormErrors({ ...postFormErrors, [`${e.target.name}Error`]: "" });
    }
    const cancel = (e) => {
        e.preventDefault();

        clear();
    }
    const clear = () => {
        setSelectedPostId(null);
        setpostsInfo({
            title: "",
            message: "",
            tags: [],
            file: "",
            likes: [],
            createdAt: null,
        });
        setPostFormErrors({
            titleError: "",
            messageError: "",
            tagsError: ""
        });
    }
    const handleInput = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e2) => {
            
            const img = document.createElement("img");
            img.src = e2.target.result;

            img.onload = (e3) => {
                const canvas = document.createElement("canvas");

                const maxWidth = 600;
                const maxHeight = e3.target.height * maxWidth / e3.target.width;

                canvas.width = maxWidth;
                canvas.height = maxHeight;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(e3.target, 0, 0, canvas.width, canvas.height);

                const srcEncodede = ctx.canvas.toDataURL(e3.target, "image/jpeg");
                console.log(srcEncodede);

                setpostsInfo({ ...postsInfo, file: srcEncodede });
            }

        }  
    }
    useEffect(() => {
        if(!(userInfo?.userInfo)){
            setUser(null);
        }
    },[userInfo])

    return(
        user?.token ? (
            <>     
                <div className="postFormContainer">
                    <h1 className="postFormHeader">{selectedPostId ? ("Edit Post") : ("Create Post")}</h1>
                    <form className="postForm" >
                        <div className='inputError'>
                            <input className="titleInput" name="title" type="text" placeholder="Title" value={postsInfo.title} onChange={handleChange} />
                            {postFormErrors.titleError && (<div className="error">{postFormErrors.titleError}</div>)}
                        </div>
                        <div className='inputError'>
                            <textarea resize="none" rows="5" className="messageInput" name="message" placeholder="Message" value={postsInfo.message} onChange={handleChange} />
                            {postFormErrors.messageError && (<div className="error">{postFormErrors.messageError}</div>)}
                        </div>
                        <div className='inputError'>
                            <ChipInput chipArray={postsInfo} setChipArray={setpostsInfo} chips={"tags"} placeholder="Tags" onChange={() => {setPostFormErrors({ ...postFormErrors, tagsError: "" })}} name="tags"/>
                            {postFormErrors.tagsError && (<div className="error">{postFormErrors.tagsError}</div>)}
                        </div>
                        <div className="fileInput">
                            <input type="file" onChange={ handleInput } />
                        </div>

                        <div className="buttons">
                            <button className="submitBtn" onClick={ handleSubmit }>Submit</button>
                            <button className="clearBtn" onClick={ cancel }>Cancel</button>
                        </div>
                    </form>
                </div>
            </>
        ) : (
        <>
            <div className="loginPrompt">
                <h1>Please Login in order to post a memory and like other memories</h1>
            </div>
        </>)
        
    );
}

export default Form;