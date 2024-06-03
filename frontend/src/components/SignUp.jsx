import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "./OAuth";

function SignUp() {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [response, setResponse] = useState({})
  const navigate = useNavigate();
  const [count, setCount] = useState(3)

  const handleSignUp = (e) => {
    e.preventDefault()
    
    if(username === '' || email === '' || password === ''){
      alert("Enter all details")
      return 
    }
  
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup`, {
      method: 'POST',
      credentials: 'include', // Ensures cookies are sent with the request
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(
        {
          username,
          email,
          password
        }
      )
    })
    .then((resp) => {
      return resp.json()
    })
    .then((data) => {

      setResponse(
        {
          status: data.statusCode, 
          message: data.message
        }
      )

      console.log(data)

      if(data.success === false){
        return;
      }

      setUsername('')
      setEmail('')
      setPassword('')
      startCounter();    

    })
    .catch((error) => {
      setResponse({
        status: 500,
        message: 'Oops! Something went wrong while connecting to the server'
      });
      console.log("some error occured while fetching: ", error)
    })

  }


  const startCounter = () => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    // Clear the interval after 3 seconds
    setTimeout(() => {
      navigate('/sign-in')
      clearInterval(intervalId);
    }, 3000);

  };



  return (
    <div className="flex flex-col items-center">

      <div className="flex flex-col items-center mt-2">
        {
          response.message && 
              <p style={{color: response.status > 299 ? 'red' : 'green' }}>
                {response.message}                
              </p>
        }

        {
          response.status < 299 &&
            <div className="flex gap-1">
              <p className="text-teal-800">Navigating to sign-in page in</p>
              <p className="text-[#4556a1]">{count}</p>
              <p className="text-teal-800">sec</p>
            </div> 
        }
      </div>

      <div className='bg-[#BCD8C1] shadow-xl w-[80vw] md:w-[45vw] lg:w-[25vw] my-3 p-3 rounded-md'>
        <h1 className='text-[#222E50] text-2xl font-semibold'>Sign Up</h1>

        <form onSubmit={handleSignUp} className='flex flex-col gap-2 mt-5'>
          <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="text" placeholder='Username' id="username"  value={username} onChange={(e) => setUsername(e.target.value)}/>
          <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="email" placeholder='Email' id="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
          <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="password" placeholder='Password' id="password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button type="submit" className='text-stone-100 text-lg mt-2 bg-[#007991] hover:opacity-85 p-2 rounded-full disabled:opacity-50'>Sign up</button>
        </form>

        <div className="mt-4 flex items-center">
          <hr className="bg-gray-500 h-[1px] flex-grow"/>
          <span className="text-gray-500 mx-4">or</span>
          <hr className="bg-gray-500 h-[1px] flex-grow"/>
        </div>

        <OAuth/>
      </div>


      <div className="flex gap-3 text-gray-800">
        <p>Have an account?</p>
        <Link to='/sign-in' className="text-blue-800 hover:underline hover:text-[#222E50]">Sign in</Link>
      </div>
        
    </div>
  )
}

export default SignUp
