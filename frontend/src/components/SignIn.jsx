import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signInSuccess, signInFailure } from "../app/userSlice"

import OAuth from "./OAuth";

function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();
  
  const { error } = useSelector((state) => state.user)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(signInFailure(null));
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault()
    
    if( email === '' || password === ''){
      alert("Enter all details")
      return 
    }
  
    fetch('/api/v1/auth/signin', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(
        {
          email,
          password
        }
      )
    })
    .then((resp) => {
      return resp.json()
    })
    .then((data) => {

      console.log(data)

      if(data.success === false){
        dispatch(signInFailure(data.message))
        return;
      }

      dispatch(signInSuccess(data))
      navigate('/')   

    })
    .catch((error) => {
      dispatch(signInFailure("Oops! Something went wrong while connecting to the server"))
      // dispatch(signInFailure(error.message))
      console.log("some error occured while sign-in: ", error)
    })

  }



  return (
    <div className="flex flex-col items-center">

      <div className="mt-2">
        {
          error && 
              <p className="text-red-500">
                {error}
              </p>
        }   
      </div>

      <div className='bg-[#BCD8C1] shadow-xl w-[80vw] md:w-[45vw] lg:w-[25vw] my-3 p-3 rounded-md'>
        <h1 className='text-[#222E50] text-2xl font-semibold'>Sign In</h1>

        <form onSubmit={handleSignIn} className='flex flex-col gap-2 mt-5'>
          <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="email" placeholder='Email' id="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="password" placeholder='Password' id="password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit" className='text-stone-100 text-lg mt-2 bg-[#007991] hover:opacity-85 p-2 rounded-full disabled:opacity-50'>Sign in</button>
        </form>

        <div className="mt-4 flex items-center">
          <hr className="bg-gray-500 h-[1px] flex-grow"/>
          <span className="text-gray-500 mx-4">or</span>
          <hr className="bg-gray-500 h-[1px] flex-grow"/>
        </div>

        <OAuth/>
      </div>
      


      <div className="flex gap-3 text-gray-800">
        <p>Dont Have an account?</p>
        <Link to='/sign-up' className="text-blue-800 hover:underline hover:text-[#222E50]">Sign Up</Link>
      </div>
      
    </div>
  )
}

export default SignIn
