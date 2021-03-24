import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Comment } from "../types";

interface IProps {
	comment: Comment;
}

dayjs.extend(relativeTime);

export const Comments: React.FC<IProps> = ({ comment }) => {
	return (
		<div key={comment.identifier}>
			<div className='flex space-x-1 text-xs'>
				<span className='text-gray-800 cursor-pointer hover:underline'>
					{comment.username}
				</span>
				<small className='text-gray-500'>
					{dayjs(comment.createdAt).fromNow()}
				</small>
			</div>
			<div>{comment.body}</div>
		</div>
	);
};
