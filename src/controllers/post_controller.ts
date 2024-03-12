import Post, { IPost } from "../models/post_model";
//import Comment from "../models/comment_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class PostController extends BaseController<IPost> {
    constructor() {
        super(Post);
    }

    async get(req: AuthRequest, res: Response) {
        console.log("Get all Posts: ");
        try {
            const posts = await Post.find()
            .select([
                "title",
                "message",
                "owner",
                "_id",
                "comments",
                "postImg",
            ])
            .populate([{ path: "owner", select: "name imgUrl" }])
            .sort({ timeStamp: -1 });
            const detailedPosts = posts
            .map((post) => post.toObject());
    
            res.send(detailedPosts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    async getPostById(postId) {
        try {
            const post = await Post.findById(postId);
            if (post) {
                const postData = {
                    title: post.title,
                    message: post.message,
                    owner: post.owner,
                    _id: post._id.toString(),
                    comments: post.comments, // Assuming comments are already populated
                    postImg: post.postImg // Assigning the URL of the image
                };
                return postData;
            } else {
                return null; // Post not found
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    }
    // async getById2(req: AuthRequest, res: Response) {
    //     console.log("Get Post by Id:" + req.params.id);
    //     try {
    //         const post = await Post.findById(req.params.id)
    //             .populate([{ path: "owner", select: "name imgUrl" }])
    //             .populate({
    //                 path: "comments",
    //                 select: "description owner",
    //                 populate: { path: "owner", select: "name imgUrl" },
    //             });
    //         if (!post) {
    //             return res.status(404).json({ message: "Post not found" }); // Return early if post is not found
    //         }
    //         console.log(post);
    //         return res.status(201).send(post); // Send the post if found
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: "Internal server error" }); // Send a generic error message
    //     }
    // }
    

    async post(req: AuthRequest, res: Response) {
        console.log("Post: " + req.body);
        const userId = req.user._id;
        req.body.author = userId;

        super.post(req, res);
    }

    // async putById(req: AuthRequest, res: Response) {
    //     console.log("Put Post by Id:" + req.params.id);
    //     super.putById(req, res);
    // }

    // async deleteById2(req: AuthRequest, res: Response) {
    //     // try {
    //     //     await Comment.deleteMany({ postId: req.params.id });
    //     // } catch (error) {
    //     //     res.status(500).json({ message: "Could not delete " });
    //     // }
    //     // console.log("Delete Post by Id:" + req.params.id);
    //     super.deleteById(req, res);
    //     }
    // }
}

export default new PostController();
