import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Axios from 'axios';

Axios.defaults.baseURL = 'http://localhost:5000/api'
Axios.defaults.withCredentials = true


import {AppProps} from 'next/app'

function MyApp({ Component, pageProps } : AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
