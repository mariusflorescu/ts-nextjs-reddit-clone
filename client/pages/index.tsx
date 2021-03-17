import Head from 'next/head'
import { useEffect, useState } from 'react'
import Axios from 'axios'

import {PostCard} from '../components/Post'

import {Post} from '../types'

export default function Home(){
  const [posts,setPosts] = useState<Post[]>();

  useEffect(() => {
    Axios.get('/posts')
        .then((res) => {
          setPosts(res.data)
        })
        .catch((err) => console.error(err))
  }, [])

  return (
    <div className="pt-12">
      <Head>
        <title>MEddit: the frontpage of the internet</title>
      </Head>
      
      <div className="container flex pt-4">
        <h1 className="text-xl">
          <div className="flex flex-col space-y-2 w-160">
          
              {posts && posts.map(post => (
               <PostCard key={post.identifier} data={post}/>
              ))}
          </div>
        </h1>
      </div>
    </div>
  )
}

