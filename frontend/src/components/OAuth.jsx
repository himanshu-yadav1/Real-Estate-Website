import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../config/firebase'
import { useDispatch } from "react-redux";
import { signInSuccess } from "../app/userSlice";
import { useNavigate } from "react-router-dom";



function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const provider = new GoogleAuthProvider()
    const auth = getAuth(app)
    
    
    const handleGoogleAuthenticaton = async() => {
        try {
            const res = await signInWithPopup(auth, provider)
            
            fetch('/api/v1/auth/google', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(
                    {
                        name: res.user.displayName,
                        email: res.user.email,
                        photo: res.user.photoURL
                    }
                )
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                dispatch(signInSuccess(data))
                navigate('/')
            })
            .catch((fetchError) => {
                console.log("Error while fetching data:", fetchError);
            });
    
    
        } catch (error) {
            console.log("Error while authentication with Google", error)
        }
    }



    return (
        <div className="flex justify-center">
            <button type="button" onClick={handleGoogleAuthenticaton} className='flex items-center gap-3 mt-4 mb-4 p-2 text-lg border border-black rounded-full disabled:opacity-50'>
                <FcGoogle className=""/>
                Continue with Google
            </button>
        </div>
  )
}

export default OAuth
