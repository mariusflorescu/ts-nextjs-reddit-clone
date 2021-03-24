import { NextFunction, Request, Response, Router } from "express";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import multer from "multer";
import path from "path";
import fs from "fs";

import User from "../entities/User";
import Sub from "../entities/Sub";

import auth from "../middleware/auth";
import user from "../middleware/user";
import Post from "../entities/Post";
import { make62BaseId } from "../utils/base62";

const createSub = async (req: Request, res: Response) => {
	const { name, title, description } = req.body;

	const user: User = res.locals.user;

	try {
		let errors: any = {};
		if (isEmpty(name)) errors.name = "Must not be empty";
		if (isEmpty(title)) errors.title = "Must not be empty";

		const sub = await getRepository(Sub)
			.createQueryBuilder("sub")
			.where("lower(sub.name) = :name", { name: name.toLowerCase() })
			.getOne();

		if (sub) errors.name = "Sub already exists";

		if (Object.keys(errors).length > 0) throw errors;
	} catch (err) {
		return res.status(400).json(err);
	}

	try {
		const sub = new Sub({ name, title, description, user });
		await sub.save();

		return res.json(sub);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Ahh... Something went wrong" });
	}
};

const getAllSubs = async (req: Request, res: Response) => {
	try {
		const subs = await Sub.find();

		return res.json(subs);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Ahh... Something went wrong" });
	}
};

const getSub = async (req: Request, res: Response) => {
	const name = req.params.name;

	try {
		const sub = await Sub.findOneOrFail({ name });
		const posts = await Post.find({
			where: { sub },
			order: { createdAt: "DESC" },
			relations: ["comments", "votes"],
		});

		sub.posts = posts;

		if (res.locals.user) {
			sub.posts.forEach((p) => p.setUserVote(res.locals.user));
		}

		return res.json(sub);
	} catch (err) {
		return res.status(404).json({ sub: "Not found" });
	}
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
	const user: User = res.locals.user;

	try {
		const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });

		if (sub.username !== user.username) {
			return res.status(403).json({ error: "Sub ownership" });
		}

		res.locals.sub = sub;
		return next();
	} catch (err) {
		return res.status(500).json({ error: "Ahh...Something went wrong" });
	}
};

const upload = multer({
	storage: multer.diskStorage({
		destination: "public/images",
		filename: (req, file, callback) => {
			const name = make62BaseId(15);
			callback(null, name + path.extname(file.originalname));
		},
	}),
	fileFilter: (_, file, callback: multer.FileFilterCallback) => {
		if (
			file.mimetype === "image/jpeg" ||
			file.mimetype === "image/png" ||
			file.mimetype === "image/jpg"
		) {
			callback(null, true);
		} else {
			callback(new Error("Not an image"));
		}
	},
});

const uploadSubImage = async (req: Request, res: Response) => {
	const sub: Sub = res.locals.sub;

	try {
		const type = req.body.type;

		if (type !== "image" && type !== "banner") {
			fs.unlinkSync(req.file.path);
			return res.status(400).json({ error: "Invalid type" });
		}

		let oldImageURN: string = "";

		if (type === "image") {
			oldImageURN = sub.imagineUrn || "";
			sub.imagineUrn = req.file.filename;
		} else if (type === "banner") {
			oldImageURN = sub.bannerUrn || "";
			sub.bannerUrn = req.file.filename;
		}

		await sub.save();

		//check if the older image exists + if it really exists in the public/images
		//if you upload a image and then delete the file from the images, it will return a 500 code since
		//in the db there is a link for an old image urn.
		if (oldImageURN !== "" && fs.existsSync(`public\\images\\${oldImageURN}`)) {
			fs.unlinkSync(`public\\images\\${oldImageURN}`);
		}
		return res.json({ sub });
	} catch (err) {
		return res.status(500).json({ error: "Ahh...Something went wrong" });
	}
};

const getTop5Subs = async (req: Request, res: Response) => {
	try {
		const subs = await Sub.find({
			relations: ["posts"],
		});

		const orderedSubs = subs.sort(function (a, b) {
			return b.posts.length - a.posts.length;
		});

		const top5 = orderedSubs.slice(0, 5);

		return res.json(top5);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Ahh... Something went wrong" });
	}
};

const router = Router();

router.post("/", user, auth, createSub);
router.get("/", getAllSubs);
router.get("/top", getTop5Subs);
router.get("/:name", user, getSub);
router.post(
	"/:name/image",
	user,
	auth,
	ownSub,
	upload.single("file"),
	uploadSubImage
);

export default router;
