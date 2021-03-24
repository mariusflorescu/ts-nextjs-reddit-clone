import Link from 'next/link';
import React from 'react';

import {Sub} from '../types'

interface IProps {
  subs: Sub[];
}

export const TopSubs : React.FC<IProps> = ({subs}) => {
  return (
    <div className="flex flex-col invisible ml-6 bg-white border border-gray-300 rounded-md lg:visible w-72 h-96">
              <div className="pt-10 pb-2 pl-4 text-white bg-purple-500 rounded-t-md">
                Top Communities
              </div>
            <div className="divide-y divide-gray-300">
              {subs && subs.map((sub,idx) => (
                <Link key={idx} href={`/r/${sub.name}`}>
                  <div className="flex items-center px-4 py-2 font-medium text-gray-700 cursor-pointer">
                  {idx+1} <img src={sub.imageUrl} className="w-8 h-8 mx-2 rounded-full"/> r/{sub.name}
                </div>
                </Link>
              ))}
            </div>

            <div className="px-2 pt-4">
              <button className="w-full py-1 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-400">
                View All
              </button>
            </div>
          </div>
  )
}
