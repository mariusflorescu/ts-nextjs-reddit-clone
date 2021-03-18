import {useRouter} from 'next/router'
import useSWR from 'swr'
import { Sub } from '../../types';

import {PostCard} from '../../components/PostCard'

export default function SubPage(){
  const router = useRouter();
  const subName = router.query.subName;

  const {data:sub,error} = useSWR<Sub>(subName ? `/subs/${subName}` : null)

  if(error) router.push('/');

  if(!sub) return (
    <p className="text-center text-md">Loading...</p>
  )

  return (
    <div className="py-12">
      <div className="w-full bg-white">
        <img src="../../images/subpage-placeholder.jpg" className="w-full h-48"/>
        <div className="w-full h-24 bg-white">
            <div className="container flex items-center space-x-4">
              <img src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" className="w-20 h-20 -mt-4 rounded-full cursor-pointer"/>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold">{sub.title}</h1>
                <small className="text-sm text-gray-400">r/{sub.name}</small>
              </div>
            </div>
        </div>
      </div>


      <div className="container flex flex-col mt-4 space-y-2">
        {sub.posts?.map((post) => (
          <PostCard key={post.identifier} data={post}/>
        ))}
      </div>
    </div>
  )
}