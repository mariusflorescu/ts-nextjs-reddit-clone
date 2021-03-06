import { Router, Request, Response } from "express";

import Comment from "../entities/Comment";
import Post from "../entities/Post";
import auth from "../middleware/auth";
import user from "../middleware/user";

const createComment = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;
	const { body } = req.body;

	try {
		const post = await Post.findOneOrFail({ identifier, slug });
		const comment = new Comment({ body, user: res.locals.user, post });

		await comment.save();

		return res.json(comment);
	} catch (err) {
		console.log(err);
		return res.status(404).json({ error: "Post not found" });
	}
};

const router = Router();

router.post("/:identifier/:slug/comments", user, auth, createComment);

export default router;
