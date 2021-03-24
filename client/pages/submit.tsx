import Link from 'next/link'
import {useRouter} from 'next/router'
import { useEffect, useState} from 'react';
import Axios from 'axios'
import classNames from 'classnames'

import {Sub} from '../types'
import { useAuthState } from '../context/auth';

interface PostError{
  community: boolean;
  title: boolean;
}

export default function Submit() {
  const router = useRouter();

  //
  const {user} = useAuthState();
  const [loading,setLoading] = useState(true);
  const [subs,setSubs] = useState<Sub[] | undefined>([]);
  const [copySubs,setCopySubs] = useState<Sub[] | undefined>([]);

  //Search bar
  const [open,setOpen] = useState(false);
  const [chosenSub,setChosenSub] = useState("");

  //Form
  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [errors,setErrors] = useState<PostError>();

  useEffect(() => {
    Axios.get('/subs')
      .then((res) => {
        setSubs(res.data);
        setCopySubs(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [])

  const toggleSearch = () => {
    setOpen(!open);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error : PostError = {
      community: false,
      title: false
    }
    if(chosenSub === '') error.community=true;
    if(title === '') error.title=true;

    if(error.community || error.title) setErrors(error);

    else{
      await Axios.post('/posts',{title,body,sub:chosenSub})
        .then(() => router.push('/'))
        .catch((err) => console.log(err))
    }
    
  }

  return (
    <div className="pt-24">
      <div className="container">
        <div onClick={toggleSearch} className="divide-y divide-white">
          <h2 className="pb-4 text-lg font-bold">Create a post</h2>
          {/*Search communities */}
          <div className="relative pt-4">
            <div onClick={toggleSearch} className={classNames("flex items-center px-2 pt-1 space-x-2 bg-white border border-gray-100 rounded", {"rounded-b-none border-b-gray-400" : open})}>
              <i className="text-gray-500 fas fa-search"></i>
              <input type="text" value={`r/${chosenSub}`} disabled={loading} onChange={(e) => setSubs(copySubs.filter((sub) => sub.name.includes(e.target.value)))} className="py-1 pr-3 bg-transparent rounded md:w-72 xl:w-160 focus:outline-none" placeholder="Choose a community"/>
            </div>
            {open && (    
              <div className="absolute w-full overflow-y-scroll bg-white divide-y divide-gray-200 rounded-b h-52">
                <div className="flex flex-col px-1 py-2">
                  <small className="pl-6 text-xs font-semibold text-gray-500">YOUR PROFILE</small>
                  <Link href="/">
                      <div className="py-2 pl-2 cursor-pointer">
                        u/{user.username}
                      </div>
                  </Link>
                </div>

                <div className="flex flex-col px-1 py-4">
                  <small className="pl-6 text-xs font-semibold text-gray-500">COMMUNITIES</small>
                  <div className="pt-2 space-y-2 flex-flex col">
                    {subs.map((sub) => (
                      <div key={sub.name} onClick={() => setChosenSub(sub.name)} className="flex items-center pl-2 cursor-pointer">
                        <img src={sub.imageUrl} className="w-8 h-8 rounded-full"/>
                        <div className="flex flex-col pl-2">
                          <p>r/{sub.name}</p>
                          <small className="text-xs text-gray-500">1,400,124 members</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
                 
                )}
          </div>
        </div>
        {/*Post form*/}
        <div className="flex flex-col pt-8 space-y-2">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full px-2 py-3 placeholder-gray-300 bg-white border border-gray-300 rounded outline-none focus:ring-1 focus:ring-black"/>
          <textarea name="Text" value={body} onChange={(e) => setBody(e.target.value)} cols={30} rows={6} className="w-full p-2 rounded-t outline-none focus:ring-1 focus:ring-black" placeholder="Text (optional)"></textarea>
          <div className="flex justify-end w-full ">
            <button type="submit" onClick={(e) => handleSubmit(e)} className="px-8 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-400">Post</button>
          </div>
        </div>
      </div>
    </div>
  )
}