import Link from 'next/link'
import { Fragment } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import {Post} from '../types';

import {Vote} from './Vote';

dayjs.extend(relativeTime);
interface IProps {
  data: Post;
}

export const PostCard : React.FC<IProps> = ({data}) =>{
  return (
    <div className="flex bg-white rounded">
      <div className="w-10 text-center bg-gray-100 rounded-l">
        <Vote post={data}/>
      </div>
      <div className="w-full p-2 rounded-r">
        <div className="flex items-center">
          <Link href={`/r/${data.subName}`}>
            <Fragment>
              <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" className="w-6 h-6 mr-1 rounded-full cursor-pointer"/>
              <a className="text-xs font-bold cursor-pointer hover:underline">r/{data.subName}</a>
          </Fragment>
        </Link>
        <p className="text-xs text-gray-500">
          <span>•</span>
          Posted by <Link href={`/u/${data.username}`}><a className="mx-1 hover:underline">/u/{data.username}</a></Link>
          <Link href={data.url}>
            <a className="mx-1 hover:underline">{dayjs(data.createdAt).fromNow()}</a>
          </Link>
        </p>
      </div>

      <Link href={data.url}>
        <Fragment>
          <a className="my-1 text-lg font-medium">{data.title}</a>  
          {data.body && (
            <p className="my-1 text-sm">{data.body}</p>
          )}
        </Fragment>
      </Link>

      <div className="flex">
        <Link href={data.url}>
          <a>
            <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
              <i className="fas fa-comment-alt fa-xs"></i>
              <span className="font-bold">{data.commentCnt} comments</span>
            </div>
          </a>
        </Link>
          <a>
            <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
              <i className="fas fa-share fa-xs"></i>
              <span className="font-bold">Share</span>
            </div>
          </a>
           <a>
            <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
              <i className="fas fa-bookmark"></i>
              <span className="font-bold">Save</span>
            </div>
          </a>
      </div>
    </div>
  </div>
  )
}