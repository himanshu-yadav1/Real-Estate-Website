import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

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
  
    fetch('/api/v1/auth/signup', {
      method: 'POST',
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
    <div className='max-w-lg mx-auto p-3 '>
      <h1 className='text-slate-800 text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
        <input className='border bg-slate-100 rounded-lg focus:outline-none p-2' type="text" placeholder='Username' id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        <input className='border bg-slate-200 rounded-lg focus:outline-none p-2' type="email" placeholder='Email' id="email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='border bg-slate-200 rounded-lg focus:outline-none p-2' type="password" placeholder='Password' id="password"  value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" className='text-stone-100 text-xl mt-2 bg-slate-800 hover:opacity-85 p-2 rounded-lg disabled:opacity-50'>SIGN UP</button>
      </form>
      
      <div className="flex gap-3 text-white mt-5">
        <p>Have an account?</p>
        <Link to='/sign-in' className="text-[#19276d] hover:underline hover:text-[#283eb0]">Sign in</Link>
      </div>
      
      <div className="flex flex-col items-center p-2">

        {
          response.message && 
              <p style={{color: response.status > 299 ? '#b62b1c' : '#008f35' }}>
                {response.message}                
              </p>
        }
        
        {
          response.status < 299 &&
            <div className="flex gap-1">
              <p>Navigating to sign-in page in</p>
              <p className="text-[#293368]">{count}</p>
              <p>sec</p>
            </div> 
        }

      </div>
    </div>
  )
}

export default SignUp
