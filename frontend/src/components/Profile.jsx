import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../config/firebase'
import { signInSuccess } from '../app/userSlice'

function Profile() {
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const userSince = currentUser.user.createdAt.slice(0, 10)

  const [updateConsoleVisibility, setUpdateConsoleVisiblity] = useState(false)
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(undefined)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [fileUploadMsg, setFileUploadMsg] = useState('')

  console.log(formData)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEditProfile = () => {
    setUpdateConsoleVisiblity(true)
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()

    const userId = currentUser.user._id

    fetch(`/api/v1/user/update/${userId}`, {
      method: "POST",
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify( formData )
    })
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      dispatch(signInSuccess(data))
      setFormData({})
      setProfilePhoto(undefined)
      setUpdateConsoleVisiblity(false)
    })
    .catch((error) => {
      alert("oops! something went wrong could not update your profile")
      console.log("error while updating profile ", error)
    })
  }

  const closeEditProfile = () => {
    setUpdateConsoleVisiblity(false)
  }


  useEffect(() => {
    if(profilePhoto){
      uploadProfilePhoto(profilePhoto)
    }
  }, [profilePhoto])

  const uploadProfilePhoto = () => {
    setFileUploadError(false)        //error set to false(if there is any previous error it will set to false while selecting new another file)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + profilePhoto.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, profilePhoto)

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        setFileUploadMsg(`Uplaoding Profile Photo (${progress}%) ...`)
      },
      (error) => {
        setFileUploadMsg('')
        setFileUploadError(true)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUploadMsg('')
          setFormData({ ...formData, updatedProfileUrl: downloadURL })
          return downloadURL
        })
        .then((downloadURL) => {
          console.log("this is url: ", downloadURL)
        })
      },

    )
  }


  return (
    <>
        <div style={{ display: updateConsoleVisibility ? 'block' : 'none' }} className='z-50 absolute bg-[white] bg-opacity-80 h-[100%] w-[100%]'>
            <div className='flex flex-col items-center mx-auto mt-7 p-4 bg-[#BCD8C1] w-[80vw] md:w-[45vw] lg:w-[28vw] shadow-2xl rounded-md'>
              
              <div className="flex justify-end w-[100%]">
                  <h1 className='text-2xl w-[90%] pl-16 font-semibold text-[#222E50]'>Edit Profile</h1>
                  <p onClick={closeEditProfile} className='relative text-2xl cursor-pointer text-gray-700 hover:text-gray-500'>X</p>
              </div>

              <form onSubmit={handleUpdateProfile} className='flex flex-col mt-5 w-[100%]'>
                <span className='px-2 text-sm text-[#63666b] text-justify'>Enter details you want to update, leave blank others</span>
                <span className='mt-3 ml-1 text-gray-700'>New Profile photo</span>
                <input onChange={e => setProfilePhoto(e.target.files[0])} type="file" accept="image/*" />
                {
                  fileUploadMsg &&
                    (
                      <span className='text-blue-950 opacity-70'>{fileUploadMsg}</span>
                    )
                }                

                {
                  fileUploadError && 
                    (
                      <span className='text-red-600'>Please upload only image file and of size less than 2MB</span>
                    )
                }
                <input className='border mt-2 bg-slate-100 rounded-lg focus:outline-none p-2' type="text" placeholder='New Username' id="updatedUsername"  value={formData.updatedUsername} onChange={handleChange}/>
                <input className='border mt-2 bg-slate-100 rounded-lg focus:outline-none p-2' type="email" placeholder='New Email' id="updatedEmail"  value={formData.updatedEmail} onChange={handleChange}/>
                <input className='border mt-2 bg-slate-100 rounded-lg focus:outline-none p-2' type="password" placeholder='New Password' id="updatedPassword"  value={formData.updatedPassword} onChange={handleChange}/>
                <button type="submit" className='text-stone-100 text-lg mt-4 bg-[#007991] hover:opacity-85 p-2 rounded-full disabled:opacity-50'>Update Profile</button>
              </form>

            </div>
        </div>



      <div className='flex flex-col'>
        <div className='bg-slate-200 w-[87%] sm:w-[70%] mt-3 mx-auto rounded-xl shadow-lg'>
          <div className='flex justify-center p-3 shadow-sm'>
            <h1 className='text-3xl font-semibold text-blue-950'>Profile</h1>
          </div>

          <div className='flex flex-col sm:flex-row items-center sm:justify-center p-5'>
            <div className='basis-1/3 flex justify-center'>
              <img className='rounded-full w-24 sm:w-40 h-24 sm:h-40' src={formData.updatedProfileUrl || currentUser.user.avatar} alt="profile" />  
            </div>

            <div className='basis-1/2 flex flex-col justify-center items-center mt-3 sm:ml-2'>
              <span className='text-2xl font-medium'>{currentUser.user.username}</span>
              <span className='mt-2'>{currentUser.user.email}</span>
              <span className='mt-6'>User since : {userSince}</span>
            </div>
          </div>

        </div>

        <div className='mt-10 sm:mt-8 flex flex-col mx-auto sm:flex-row gap-3'>
          <button onClick={handleEditProfile} className='bg-[#439A86] p-3 sm:p-2 rounded-lg text-lg w-40 text-white hover:bg-white hover:border hover:border-[#439A86] hover:text-[#222E50] ease-in-out duration-200'>Edit Profile</button>
          <button className='bg-transparent p-3 sm:p-2 rounded-lg text-lg text-[#222E50] w-40 border border-[#439A86] hover:bg-[#439A86] hover:text-white ease-in-out duration-200'>Create Listing</button>
        </div>

        <div className='flex gap-5 sm:gap-10 p-2 sm:p-8 mt-5 sm:mt-0 mx-auto font-mono'>
          <div className='flex flex-col gap-1 text-lg items-center '>
            <p className='text-red-700 cursor-pointer hover:text-red-500'>Sign Out</p>
            <p className='text-red-700 cursor-pointer hover:text-red-500'>Delete Account</p>
          </div>      

          <div className=''>
            <p className='text-xl text-green-700 cursor-pointer hover:text-green-500'>Show Listings</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
