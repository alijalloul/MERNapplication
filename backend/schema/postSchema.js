import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creatorID: String,
    name: String,
    tags: [String],
    file: String,
    likes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    comments: {
        type: [String],
        default: []
    }
});

const posts = mongoose.model("posts", postSchema);

export default posts;