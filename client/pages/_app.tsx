import {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import React,{Fragment} from 'react';
import Axios from 'axios';

import Navbar from '../components/Navbar'

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '../styles/icons.css'

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function MyApp({ Component, pageProps } : AppProps) {
  const {pathname} = useRouter();
  const authRoutes = ['/register','/login']

  const authRoute = authRoutes.includes(pathname)

  return (<Fragment>
    {!authRoute && <Navbar/>}
    <Component {...pageProps}/>
  </Fragment>)
}

export default MyApp
