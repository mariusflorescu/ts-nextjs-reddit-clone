import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import { Sub } from '../../types';
import classNames from 'classnames';
import Axios from 'axios'

import {PostCard} from '../../components/PostCard'
import { ChangeEvent, ChangeEventHandler, createRef, useEffect, useState } from 'react';

import {useAuthState} from '../../context/auth'

export default function SubPage(){
  const {auth,user} = useAuthState();

  const router = useRouter();
  const subName = router.query.subName;

  const fileInputRef = createRef<HTMLInputElement>();

  const {data:sub,error,revalidate} = useSWR<Sub>(subName ? `/subs/${subName}` : null)

  if(error) router.push('/');

  if(!sub) return (
    <p className="text-center text-md">Loading...</p>
  )

  const openFileInput = (type:string) => {
    if(! (user.username === sub.username)) return;

    fileInputRef.current.name = type;
    fileInputRef.current.click();
  }

  const uploadImage = async (e:ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    const formData = new FormData()

    formData.append('file',file)
    formData.append('type',fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`,formData,{
        headers:{'Content-Type':'multipart/form-data'}
      })

      revalidate();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      <div className="py-12">
        <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage}/>
        <div className="w-full bg-white">
          {sub?.bannerUrl ? (
            <img onClick={()=> openFileInput('banner')} src={sub?.bannerUrl} className={classNames("w-full h-48", {'cursor-pointer' : (user.username === sub.username)})}/>
          ) : (
            <div onClick={()=> openFileInput('banner')} className={classNames("w-full h-48 bg-blue-500", {'cursor-pointer' : (user.username === sub.username)})}></div>
          )}
          <div className="w-full h-24 bg-white">
              <div className="container relative flex items-center space-x-4">
                <div className="absolute -top-6">
                  <Image onClick={()=> openFileInput('image')} src={sub.imageUrl} width={90} height={90} className={classNames("rounded-full",{'cursor-pointer' : (user.username === sub.username)})}/>
                </div>
                <div className="flex flex-col pt-1 pl-20">
                  <h1 className="text-3xl font-bold">{sub.title}</h1>
                  <small className="text-sm font-bold text-gray-500">r/{sub.name}</small>
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
    </div>
  )
}