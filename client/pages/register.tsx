import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react';
import Axios from 'axios'
import {useRouter} from 'next/router'

import Input from '../components/Input'

export default function Register() {
  const router = useRouter()

  const [username, setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [agreement,setAgreement] = useState(false);

  const [errors,setErrors] = useState<any>({});

  const submitForm = async (e:FormEvent) => {
    e.preventDefault();

    if(!agreement){
      setErrors({...errors,agreement:'You must agree Terms & Conditions'})
      return
    }

    try {
      await Axios.post('/auth/register', {
        username, email, password
      })

      router.push('/login');
    } catch (err) {
      setErrors(err.response.data);
    }
  }

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      
      <div className="w-40 h-screen bg-center bg-cover" style={{backgroundImage: "url('images/flamingo.jpg')"}}></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="flex flex-col w-72">
          <h1 className="mb-2 text-xl font-medium">Sign up</h1>
          <p className="mb-8 text-xs text-gray-700">By continuing, you agree to our User Agreement and Privacy Policy</p>

          <form className="flex flex-col mt-4 space-y-3" onSubmit={submitForm}>
            <div>
              <input type="checkbox" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} className="mr-1 cursor-pointer" id="agreement"/>
              <label htmlFor="agreement" className="text-xs text-gray-700 cursor-pointer">I agree to get emails about the cool stuff that's happening</label>
              <small className="block font-medium text-red-500">{errors.agreement}</small>
            </div>

            <Input type="text" value={username} setValue={setUsername} error={errors.username} placeholder="Username..."/>
            <Input type="email" value={email} setValue={setEmail} error={errors.email} placeholder="Email..."/>
            <Input type="password" value={password} setValue={setPassword} error={errors.password} placeholder="Password..."/>

            <button className="py-2 text-xs font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded-md hover:bg-blue-600">Sign up</button>
          </form>

          <small className="pt-3 text-gray-700">Already a Medditor? <Link href="/login"><a className="ml-2 text-blue-500 uppercase">Log In</a></Link></small>
        </div>
      </div>

    </div>
  )
}
