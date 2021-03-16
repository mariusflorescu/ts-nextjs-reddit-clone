import Head from 'next/head'
import Axios from 'axios'

import { GetServerSideProps } from 'next'

import {PostCard} from '../components/Post'

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
               <PostCard postKey={post.identifier} data={post}/>
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