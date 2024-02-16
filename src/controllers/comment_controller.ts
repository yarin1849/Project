import { Request, Response } from 'express';
import CommentModel, { IComment } from '../models/comment_model';

// Controller function to create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, userId, content } = req.body;

    // Create a new comment object
    const newComment: IComment = new CommentModel({
      postId,
      userId,
      content,
    });
    // Save the new comment to the database
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create comment' });
  }
};

// Controller function to get comments for a specific post
export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    // Find all comments associated with the specified post ID
    const comments = await CommentModel.find({ postId });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Unable to get comments' });
  }
};

// Controller function to update a comment
export const updateComment = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId;
      const { content } = req.body;
  
      // Find the comment by ID and update its content
      const updatedComment = await CommentModel.findByIdAndUpdate(
        commentId,
        { content },
        { new: true } // Return the updated comment
      );
  
      if (!updatedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update comment' });
    }
  };
  
  export const deleteComment = async (req: Request, res: Response) => {
    try {
      const commentId = req.params.commentId;
  
      // Find the comment by ID and delete it
      const deletedComment = await CommentModel.findByIdAndDelete(commentId);
  
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete comment' });
    }
  };
  