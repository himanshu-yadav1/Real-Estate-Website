import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { signInSuccess, signInFailure } from "../app/userSlice"

function SignIn() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();
  
  const { error } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleSignUp = (e) => {
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
      dispatch(signInFailure(error.message))
      console.log("some error occured while sign-in: ", error)
    })

  }



  return (
    <div className='max-w-lg mx-auto p-3 '>
      <h1 className='text-slate-800 text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
       <input className='border bg-slate-200 rounded-lg focus:outline-none p-2' type="email" placeholder='Email' id="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='border bg-slate-200 rounded-lg focus:outline-none p-2' type="password" placeholder='Password' id="password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" className='text-stone-100 text-xl mt-2 bg-slate-800 hover:opacity-85 p-2 rounded-lg disabled:opacity-50'>SIGN IN</button>
      </form>
      
      <div className="flex gap-3 text-white mt-5">
        <p>Dont Have an account?</p>
        <Link to='/sign-up' className="text-[#19276d] hover:underline hover:text-[#283eb0]">Sign Up</Link>
      </div>

      <div className="flex flex-col items-center p-2">

        {
          error && 
              <p style={{ color: '#b62b1c' }}>
                {error}
              </p>
        }

      </div>

    </div>
  )
}

export default SignIn
