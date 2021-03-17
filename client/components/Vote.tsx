import React, { useState } from 'react';
import Axios from 'axios'
import classNames from 'classnames'

import {Post} from '../types'

interface IProps{
  post:Post;
}

export const Vote : React.FC<IProps> = ({post}) => {
  const [userVoteValue,setUserVoteValue] = useState(post.userVote);
  const [voteScore,setVoteScore] = useState(post.voteScore);

  const vote = async (value) => {
    let chooseVoteValue = userVoteValue ? 0 : value; 
    if(!chooseVoteValue) setUserVoteValue(0);

    try {
      const res = await Axios.post('/misc/vote', {
        identifier: post.identifier,
        slug: post.slug,
        value: chooseVoteValue
      })
      setUserVoteValue(res.data.userVote);
      setVoteScore(res.data.voteScore);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="pt-2 text-sm">
      <div onClick={() => vote(1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500">
        <i className={classNames("icon-arrow-up", {
          'text-red-500' : userVoteValue === 1
        })}></i>
      </div>
      <p className="text-xs font-bold text-gray-400">{voteScore}</p>
      <div onClick={() => vote(-1)} className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500">
        <i className={classNames("icon-arrow-down", {
          'text-blue-500' : userVoteValue === -1
        })}></i>
      </div>
    </div>
  )
}