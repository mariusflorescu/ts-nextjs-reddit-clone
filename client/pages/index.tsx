import Head from 'next/head'
import { Fragment, useEffect, useState } from 'react'
import Axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import {Post} from '../types';
import Link from 'next/link';
import { GetServerSideProps } from 'next'

dayjs.extend(relativeTime);

export default function Home({posts}) {
  return (
    <div className="pt-12">
      <Head>
        <title>MEddit: the frontpage of the internet</title>
      </Head>
      
      <div className="container flex pt-4">
        <h1 className="text-xl">
          <div className="flex flex-col space-y-2 w-160">
              {posts.map(post => (
                <div key={post.identifier} className="flex bg-white rounded">
                  {/* Votes */}
                  <div className="w-10 text-center bg-gray-100 rounded-l">V</div>

                  {/*Post */}
                  <div className="w-full p-2 rounded-r">
                    <div className="flex items-center">
                      <Link href={`/r/${post.subName}`}>
                        <Fragment>
                          <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" className="w-6 h-6 mr-1 rounded-full cursor-pointer"/>
                          <a className="text-xs font-bold cursor-pointer hover:underline">r/{post.subName}</a>
                        </Fragment>
                      </Link>
                      <p className="text-xs text-gray-500">
                        <span>•</span>
                        Posted by <Link href={`/u/${post.username}`}><a className="mx-1 hover:underline">/u/{post.username}</a></Link>
                        <Link href={post.url}>
                          <a className="mx-1 hover:underline">{dayjs(post.createdAt).fromNow()}</a>
                        </Link>
                      </p>
                    </div>

                    <Link href={post.url}>
                      <Fragment>
                        <a className="my-1 text-lg font-medium">{post.title}</a>  
                        {post.body && (
                          <p className="my-1 text-sm">{post.body}</p>
                        )}
                      </Fragment>
                    </Link>

                    <div className="flex">
                      <Link href={post.url}>
                        <a>
                          <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                            <i className="fas fa-comment-alt fa-xs"></i>
                            <span className="font-bold">30 comments</span>
                          </div>
                        </a>
                      </Link>

                      <a>
                          <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                            <i className="fas fa-bookmark"></i>
                            <span className="font-bold">30 comments</span>
                          </div>
                        </a>

                        <a>
                          <div className="p-1 mr-2 space-x-1 text-xs text-gray-500 rounded cursor-pointer hover:bg-gray-200">
                            <i className="fas fa-share fa-xs"></i>
                            <span className="font-bold">30 comments</span>
                          </div>
                        </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </h1>
      </div>

    </div>
  )
}


export const getServerSideProps:GetServerSideProps = async (context) =>{
  try {
    const res = await Axios.get('/posts');

    return {props:{posts: res.data}}
  } catch (err) {
    return {
      //redirect to 500
      props: {
        error: 'Something went wrong...'
      }
    }
  }
}