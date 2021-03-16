import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react';
import Axios from 'axios'
import {useRouter} from 'next/router'

import Input from '../components/Input'

export default function Register() {
  const router = useRouter()

  const [username, setUsername] = useState("");
  const [password,setPassword] = useState("");

  const [errors,setErrors] = useState<any>({});

  const submitForm = async (e:FormEvent) => {
    e.preventDefault();

    try {
      await Axios.post('/auth/login', {
        username, password
      })

      router.push('/');

    } catch (err) {
      setErrors(err.response.data);
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      
      <div className="w-40 h-screen bg-center bg-cover" style={{backgroundImage: "url('images/flamingo.jpg')"}}></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="flex flex-col w-72">
          <h1 className="mb-2 text-xl font-medium">Login</h1>

          <form className="flex flex-col mt-4 space-y-3" onSubmit={submitForm}>
            <Input type="text" value={username} setValue={setUsername} placeholder="Username..."/>
            <Input type="password" value={password} setValue={setPassword} placeholder="Password..."/>
            <button className="py-2 text-xs font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600">Login</button>
            <small className="block text-sm font-bold text-red-500">{errors.password}</small>
          </form>

          <small className="pt-3 text-gray-700">Forgot your password?<Link href="/forgot"><a className="ml-2 text-blue-500 uppercase">Click here</a></Link></small>
          <small className="pt-3 text-gray-700">New to MEddit?<Link href="/register"><a className="ml-2 text-blue-500 uppercase">Create an account</a></Link></small>

        </div>
      </div>

    </div>
  )
}
