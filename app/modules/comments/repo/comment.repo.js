const CommentModel = require("../model/comment.model")

class CommentRepo {
    async createComment(commentData) {
        try {
            const newComment = await CommentModel.create(commentData);
            return newComment;
        } catch (err) {
            console.error('Error in CommentRepo -> createComment: ', err);
            throw err;
        }
    };

    async getAllComments() {
        try {
            const comments = await CommentModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$isDeleted', false] },
                            ],
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'byUser',
                        foreignField: '_id',
                        as: 'userComments',
                    },
                },
                {
                    $lookup: {
                        from: 'admins',
                        localField: 'byAdmin',
                        foreignField: '_id',
                        as: 'adminComments',
                    },
                },
            ]);
            return comments;
        } catch (err) {
            console.error('Error in CommentRepo -> getAllComments: ', err);
            throw err;
        }
    };

    async deleteComment(commentId) {
        try {
            const deletedComment = await CommentModel.findByIdAndUpdate(
                commentId,
                { isDeleted: true },
                { new: true }
            );
            return deletedComment;
        } catch (err) {
            console.error('Error in CommentRepo -> deleteComment: ', err);
            throw err;
        }
    }
}