import Link from "next/link";

export const CreatePost = () => {
	return (
		<div className='px-4 py-4 bg-white border border-gray-300'>
			<Link href='/submit'>
				<input
					type='text'
					placeholder='Create Post'
					className='w-full p-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-white hover:border-blue-500'
				/>
			</Link>
		</div>
	);
};
