const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
    },
    content: {
        type: String,
        required: "Blog Content is required",
    },
    approved: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedBy: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
})

commentSchema.pre("validate", (next) => {
    if (!this.userId && !this.adminId) {
        const err = new Error("Either userId or adminId must be provided")
        next(err)
    } else {
        next()
    }
})

const CommentModel = mongoose.model("comment", commentSchema)
module.exports = CommentModel