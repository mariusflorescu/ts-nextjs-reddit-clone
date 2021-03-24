import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import {useRouter} from 'next/router'
import React,{useState} from 'react'
import useSWR from 'swr';
import { Vote } from '../../../../components/Vote';
import {useAuthState} from '../../../../context/auth'
import { Post, Sub } from '../../../../types';
import {Comments} from '../../../../components/Comments'
import Axios from 'axios'
import classNames from 'classnames'

dayjs.extend(relativeTime);

export default function slug() {
  const {auth,user} = useAuthState();

  const [body,setBody] = useState("");
  const [commentError,setCommentError] = useState(false);

  const router = useRouter();
  const identifier = router.query.identifier;
  const slug = router.query.slug;

  const {data,error,revalidate} = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)

  if(error) return (<small className="pt-16 text-red-500">Uhh... Something went bad</small>)

  if(data) console.log(data);

  const submitComment = async (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(body.trim() === ''){
      setCommentError(true);
      return;
    } else {
      setCommentError(false);
    }
    e.preventDefault();

    await Axios.post(`/posts/${data.identifier}/${data.slug}/comments`,{body})
          .then(() => {
            setBody("");
            revalidate();
          })
          .catch((err) => console.log(err))
  }

  return (
    <div className="pt-16">

      {data && (
        <div className="container">
          <div className="p-2 bg-white border-gray-200 rounded">
            {/* Post header (votes details etc...) */}
              <div className="flex pl-4 space-x-2">
                  <Vote post={data}/>
                <div className="flex flex-col w-full">
                  <div className="flex items-center space-x-1 text-xs">
                    <small className="font-semibold text-gray-700">r/{data.subName}</small>
                    <span>•</span>
                    <small className="text-gray-500">Posted by u/{data.username}</small>
                    <span>•</span>
                    <a className="mx-1 hover:underline">{dayjs(data.createdAt).fromNow()}</a>
                  </div>

            {/* content */}
                  <h1 className="text-xl font-semibold">{data.title}</h1>
                  <p>{data.body}</p>

                   {/* Comments & stuff */}
                   <div className="flex pt-4 space-x-1">
                    <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                      <i className="fas fa-comment-alt fa-xs"></i>
                      <span className="font-bold">{data.commentCnt} comments</span>
                    </div>

                    <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                      <i className="fas fa-share fa-xs"></i>
                      <span className="font-bold">Share</span>
                    </div>

                    <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                      <i className="fas fa-bookmark"></i>
                      <span className="font-bold">Save</span>
                    </div>
                  </div>
            {/* Comment box if logged in */}
                {auth && (
                  <div className="w-full px-2 mt-8">
                    <p className="text-sm">Comment as <Link href={`/u/${user.username}`}><a className="text-blue-500 cursor-pointer">{user.username}</a></Link></p>
                    <textarea name="Text" value={body} onChange={(e) => setBody(e.target.value)} cols={30} rows={6} className={classNames("w-full p-2 mt-1 rounded-t outline-none ring-1 ring-gray-300 focus:ring-black", {"ring-red-500" : commentError})} placeholder="What are your thoughts?"></textarea> 
                    {commentError && (
                      <small className="pt-2 text-xs font-semibold text-red-500">Comment body must not be empty</small>
                    )}
                    <div className="flex justify-end w-full ">
                      <button type="submit" onClick={(e) => submitComment(e)} className="px-8 py-1 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-400">Comment</button>
                    </div>
                  </div>
                )}
            {/* Comments */}
                  <div className="flex flex-col mt-4 mb-4 space-y-3">
                    {data.comments.map((comment) => (
                      <Comments comment={comment}/>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </div>

      )}

    </div>
  )
}
