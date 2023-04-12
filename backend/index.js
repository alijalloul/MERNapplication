import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";    

import auth from "./middleware/middleware.js";
import postDB from "./schema/postSchema.js";
import userDB from "./schema/userSchema.js";

const app = express();
app.use(cors());
app.use(express.json({limit:'50mb'}));

const imagesFolder = "./postImages";
const atlasURL = "mongodb+srv://reactjsdatabase:12345@cluster0.1djt5oa.mongodb.net/?retryWrites=true&w=majority";    
const PORT = process.env.PORT || 5000;

mongoose.connect(atlasURL)
    .then(() => app.listen(PORT, () => console.log(`Successfully connected to port ${PORT}`)))
    .catch(error => console.log("There was an error: ", error));


//app.listen(PORT, () => console.log(`Successfully connected to port ${PORT}`));
app.get("/", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "true");
    res.send("SERVER IS RUNNIGN");
});
app.get("/posts", async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const totalPosts = await postDB.countDocuments({});

        const posts = await postDB.find().sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        posts.map(post => {
            const imagePath = path.join(imagesFolder, post.file);

            var base64Data;
            if(fs.existsSync(imagePath)){
                base64Data = fs.readFileSync(imagePath, { encoding: 'base64' });
            }else {
                base64Data = fs.readFileSync('./postImages/notfound.jpeg').toString("base64");
            }



            post.file = "data:image/png;base64," + base64Data;  
        })

        
        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(totalPosts/LIMIT)});
    } catch (error) {
        res.send("There was an error: ", error);
    }
});
app.get("/posts/search", async (req, res) => {
    const { searchQuery, tags, page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;

        const title = new RegExp(searchQuery, 'i'); 
        const totalPosts = await postDB.countDocuments({ $or: [{ title }, { tags: { $in: tags.split(",") } }] });
        
        const posts = await postDB.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] }).sort({ _id: -1}).limit(LIMIT).skip(startIndex);

        posts.map(post => {
            const imagePath = path.join(imagesFolder, post.file);

            var base64Data;
            if(fs.existsSync(imagePath)){
                base64Data = fs.readFileSync(imagePath, { encoding: 'base64' });
            }else {
                base64Data = fs.readFileSync('./postImages/notfound.jpeg').toString("base64");
            }



            post.file = "data:image/png;base64," + base64Data;  
        })

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(totalPosts/LIMIT)});
    } catch (error) {
        res.status(409).json( { message: error.message } );
    }
});
app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const posts = await postDB.findById(id);

        const imagePath = path.join(imagesFolder, posts.file);

        var base64Data;
        if(fs.existsSync(imagePath)){
            base64Data = fs.readFileSync(imagePath, { encoding: 'base64' });
        }else {
            base64Data = fs.readFileSync('./postImages/notfound.jpeg').toString("base64");
        }



        posts.file = "data:image/png;base64," + base64Data;  

        res.json(posts);
    } catch (error) {
        res.send("There was an error: ", error);
    }
});
app.post("/posts", async (req, res) => {
    const body = req.body;
    const base64Image = body.file;

    // Extract image type and base64 data
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
    
    const filename = `image-${body.creatorID}-${Date.now()}.${fileExtension}`;
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);

    body.file = filename;

    console.log("body.file changed: ", body);

    const newPost = new postDB(body);

    try {
        await newPost.save();

        res.json({
            status: "success",

            _id: newPost._id,
            title: body.title,
            message: body.message,
            name: body.name,
            tags: body.tags,
            file: body.file,
            likes: body.likes,
            createdAt: body.createdAt,
        });
    } catch (error) {
        res.status(409).json( { message: error.message } );
    }
});

app.patch('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const post = req.body;

    const base64Image = post.file;

    // Extract image type and base64 data
    const fileExtension = base64Image.split(';')[0].split('/')[1];
    const buffer = Buffer.from(base64Image.split(',')[1], 'base64');
    
    const filename = `image-${post.creatorID}-${Date.now()}.${fileExtension}`;
    fs.writeFileSync(path.join(imagesFolder, filename), buffer);

    post.file = filename;    

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    }

    const updatedPost = await postDB.findByIdAndUpdate(id, post, { new: true});

    res.json(updatedPost);
});

app.patch('/:id/likePost', auth, async (req, res) => {
    const { id } = req.params;

    if(!req.userId) return res.json({ message: "unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    }

    const post = await postDB.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter(id => id !== String(req.userId));
    }
    const updatedPost = await postDB.findByIdAndUpdate(id, { likes: post.likes }, { new: true});

    res.json(updatedPost.likes);
});

app.post('/:id/postComment', auth, async (req, res) => {
    const { id } = req.params;
    const comment = req.body.commentInfo;
    console.log(comment);

    if(!req.userId) return res.json({ message: "unauthenticated" });

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    }

    const post = await postDB.findById(id);
    
    post.comments.push(comment);

    const updatedPost = await postDB.findByIdAndUpdate(id, { comments: post.comments }, { new: true});

    res.json(updatedPost.comments);
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No post with that id');
    }

    await postDB.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully!'});
});

app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
     
    try{
        const existingUser = await userDB.findOne({ email });

        if(!existingUser) return res.status(404).json({ message: "User doesn't exist"});

        const validPassword = await bcrypt.compare(password, existingUser.password);

        if(!validPassword) return res.status(400).json({ message: "Invalid password"});

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id}, "sk", { expiresIn: "1hr"});
        
        res.status(200).json({ result: existingUser, token});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}); 
app.post("/users/signup", async (req, res) => {
    const { firstName, lastName, email, password, repassword} = req.body;

    try{
        const existingUser = await userDB.findOne({ email });

        if(existingUser) {console.log("same User");return res.status(400).json({ message: "Account already exists." })};

        if(password !== repassword) return res.status(400).json({ message: "Passwords do not match." });

        const hashedPass = await bcrypt.hash(password, 12);

        const result = await userDB.create({ email, password: hashedPass, name: `${firstName} ${lastName}`});
        const token = jwt.sign({ email: result.email, id: result._id}, "sk", { expiresIn: "1hr"});

        res.status(200).json({ result, token });

    }catch (error){
        res.status(500).json({message: error.message});
    }
});