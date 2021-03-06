import { Router, Request, Response } from "express";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import auth from "../middleware/auth";
import user from "../middleware/user";

const createPost = async (req: Request, res: Response) => {
	const { title, body, sub } = req.body;

	const user = res.locals.user;

	if (title.trim() === "")
		return res.status(400).json({ title: "Must not be empty" });

	try {
		const isSub = await Sub.findOneOrFail({ name: sub });

		const post = new Post({ title, body, user, sub: isSub });
		await post.save();

		return res.json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Ah... something went wrong" });
	}
};

const getPosts = async (_: Request, res: Response) => {
	try {
		const posts = await Post.find({
			order: { createdAt: "DESC" },
			relations: ["comments", "votes", "sub"],
		});

		if (res.locals.user) {
			posts.forEach((p) => p.setUserVote(res.locals.user));
		}

		return res.json(posts);
	} catch (err) {
		console.log(err);
		return res.json({ error: "Ahh... Something went wrong" });
	}
};

const getPost = async (req: Request, res: Response) => {
	const { identifier, slug } = req.params;
	try {
		const post = await Post.findOneOrFail(
			{ identifier, slug },
			{ relations: ["sub", "votes", "comments"] }
		);

		if (res.locals.user) {
			post.setUserVote(res.locals.user);
		}

		return res.json(post);
	} catch (err) {
		console.log(err);
		return res.status(404).json({ error: "Post does not exist" });
	}
};

const router = Router();

router.post("/", user, auth, createPost);
router.get("/", user, getPosts);
router.get("/:identifier/:slug", user, getPost);

export default router;
