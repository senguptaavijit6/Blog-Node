const mongoose = require("mongoose")

const futureBlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Blog title is required",
    },
    content: {
        type: String,
        required: "Blog Content is required",
    },
    image: {
        type: String,
        required: "Blog Image is required",
    },
    publishAt: {
        type: Date,
        default: Date.now(),
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    authorGMT: {
        type: String,
        required: "Author GMT is required",
    },
    authorRole: {
        type: String,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },
    adminRole: {
        type: String,
    },
    likesFromUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    likesFromAdmins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admins"
        }
    ],
    dislikesFromUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    dislikesFromAdmins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admins"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments",
        },
    ],
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
    }],
    tags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tags",
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
    },
    deleteReason: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
})

const FutureBlogModel = mongoose.model("future_blogs", futureBlogSchema)
module.exports = FutureBlogModel