import Link from 'next/link';
import React from 'react';
import Logo from '../images/logo.svg';

const Navbar : React.FC = () => (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-12 bg-white">
      <div className="flex items-center">
        <Link href="/">
          <a>
            <Logo className="w-8 h-8 mr-2"/>
          </a>
        </Link>

        <span className="text-2xl font-semibold">
          <Link href="/">MEddit</Link>
        </span>
      </div>

      <div className="flex items-center transition duration-200 bg-gray-100 border rounded hover:bg-white hover:border-blue-500">
        <span className="pl-3 pr-4 text-gray-500 fas fa-search"></span>
        <input type="text" className="py-1 pr-3 bg-transparent rounded md:w-72 xl:w-160 focus:outline-none" placeholder="Search"/>
      </div>

      <div className="flex items-center space-x-2">
        <Link href='/login'><a className="px-8 py-1 text-sm font-semibold leading-6 text-blue-500 border border-blue-500 rounded-full hover:bg-gray-100">Log In</a></Link>
        <Link href='/login'><a className="px-8 py-1 text-sm font-semibold leading-6 text-white bg-blue-500 border border-blue-500 rounded-full hover:bg-blue-400">Sign Up</a></Link>
      </div>
    </div>
);

export default Navbar;