import {AppProps} from 'next/app'
import {useRouter} from 'next/router'
import React,{Fragment} from 'react';
import Axios from 'axios';
import {SWRConfig} from 'swr'

import {AuthProvider} from '../context/auth'

import Navbar from '../components/Navbar'

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '../styles/icons.css'

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true

function MyApp({ Component, pageProps } : AppProps) {
  const {pathname} = useRouter();
  const authRoutes = ['/register','/login']

  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url:string) => {
    try {
      const res = await Axios.get(url);
      return res.data;
    } catch (err) {
      throw err.response.data
    }
  }

  return (
    <AuthProvider>
      <SWRConfig
        value={{
          fetcher,
          dedupingInterval: 2000,
        }}
      >
        <Fragment>
          {!authRoute && <Navbar/>}
          <Component {...pageProps}/>
        </Fragment>
      </SWRConfig>
    </AuthProvider>
  )
}

export default MyApp
