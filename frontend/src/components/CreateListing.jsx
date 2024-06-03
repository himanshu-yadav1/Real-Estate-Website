import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../config/firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function CreateListing() {
    const { currentUser } = useSelector(state => state.user)
    const [files, setFiles] = useState([])
    const [imageUploadError , setImageUploadError] = useState(false)
    const [formData, setFormData] = useState(
        {
            title: '',
            description: '',
            address: '',
            type: 'rent',
            parking: false,
            furnished: false,
            offer: false,
            bedrooms: 1,
            bathrooms: 1,
            regularPrice: 5000,
            discountedPrice: 0,
            imageUrls: [],
        }
    )
    const [uploadingFiles, setUploadingFiles] = useState(false)
    const [error, setError] = useState(false)

    const navigate = useNavigate()




    const handleFileUpload = () => {
        if(files.length > 0 && (files.length + formData.imageUrls.length) < 7){
            setUploadingFiles(true)
            setError(false)

            const promises = []

            for(let fileNumber = 0; fileNumber < files.length; fileNumber++){
                promises.push(uploadImageOnFirebase(files[fileNumber]))
            }

            Promise.all(promises).then((urls) => {
                console.log(urls)
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploadingFiles(false)
            })
            .catch((error) => {
                setImageUploadError('Please ensure to upload only image file and of size less than 2MB each.')
                setUploadingFiles(false)
            })

        }
        else{
            setImageUploadError('You can upload maximum 6 photos per listing')
        }
    }

    const uploadImageOnFirebase = async(file) => {
        return new Promise((resolve, reject) => {
            setImageUploadError(false)

            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on("state_changed", 
                (snapshot) => {

                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData(
            {
                formData,
                imageUrls: formData.imageUrls.filter((_, i) => i != index)
            }
        )
    }

    const handleChangeInFormData = (e) => {
        if(e.target.id == 'sale' || e.target.id == 'rent'){
            setFormData(
                {
                    ...formData,
                    type: e.target.id
                }
            )
        }

        if(e.target.id == 'parking' || e.target.id == 'furnished' || e.target.id == 'offer'){
            setFormData(
                {
                    ...formData,
                    [e.target.id]: e.target.checked
                }
            )
        }

        if(e.target.type == 'text' || e.target.type == 'textarea' || e.target.type == 'number'){
            setFormData(
                {
                    ...formData,
                    [e.target.id]: e.target.value
                }
            )
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(formData.imageUrls.length < 1){
            return setError("Add atleast one image to create listing")
        }


        if(+formData.regularPrice < +formData.discountedPrice){
            return setError("Discounted Price must be lower than Regular Price")
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/listing/create`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json'},
            body: JSON.stringify( 
                {
                    ...formData,
                    user: currentUser.user._id
                }
            )
        })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            if(data.success === false){
                return setError(data.message)
            }

            setError(false)
            setFormData(
                {
                    title: '',
                    description: '',
                    address: '',
                    type: 'rent',
                    parking: false,
                    furnished: false,
                    offer: false,
                    bedrooms: 1,
                    bathrooms: 1,
                    regularPrice: 5000,
                    discountedPrice: 5000,
                    imageUrls: [],
                }
            )
            

            navigate(`/listing/${data.listing._id}`)

        })
        .catch((error) => {
            setError(error.message)
        })
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' onChange={handleChangeInFormData} value={formData.title} placeholder='Title' required className='border p-3 rounded-lg' id='title' maxLength='62' minLength='5' />
                <textarea type='text' onChange={handleChangeInFormData} value={formData.description} placeholder='Description' required className='border p-3 rounded-lg' id='description' />
                <input type='text' onChange={handleChangeInFormData} value={formData.address} placeholder='Address' required className='border p-3 rounded-lg' id='address' />

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChangeInFormData} checked={formData.type === 'sale'} id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChangeInFormData} checked={formData.type === 'rent'} id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChangeInFormData} checked={formData.parking} id='parking' className='w-5' />
                        <span>Parking spot</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChangeInFormData} checked={formData.furnished} id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChangeInFormData} checked={formData.offer} id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' onChange={handleChangeInFormData} value={formData.bedrooms} id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                        <p>Beds</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='number' onChange={handleChangeInFormData} value={formData.bathrooms} id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                        <p>Baths</p>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input type='number' onChange={handleChangeInFormData} value={formData.regularPrice} id='regularPrice' min='5000' max='100000000' required className='p-3 border border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                        <p>Regular price</p>
                        {formData.type === 'rent' && (
                            <span className='text-xs'>($ / month)</span>
                        )}
                        </div>
                    </div>

                    {
                        formData.offer && 
                        <div className='flex items-center gap-2'>
                            <input type='number' onChange={handleChangeInFormData} value={formData.discountedPrice} id='discountedPrice' min='0' max='100000000' required className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                            <p>Discounted price</p>
                            {formData.type === 'rent' && (
                                <span className='text-xs'>($ / month)</span>
                            )}
                            </div>
                        </div>
                    }

                </div>
            </div>


            <div className="flex flex-col flex-1 gap-4">
                <p className='font-semibold'>Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>

                <div className="flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" multiple id='images' accept='image/*' />
                    <button type='button' onClick={handleFileUpload}  disabled={uploadingFiles} className={ `p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:hover:shadow-none disabled:opacity-80 disabled:text-gray-700 disabled:border-gray-700 ${uploadingFiles ? '' : 'uppercase'}` }>{uploadingFiles ? 'Uploading...' : 'Upload'}</button>
                </div>

                <p className='text-red-600 text-sm'>
                    {imageUploadError && imageUploadError}
                </p>

                {
                    error && <p className='text-sm text-red-600'> {error} </p>
                }

                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className='flex justify-between p-3 border items-center rounded-lg'>
                            <img src={url} alt="lsiting image" className='w-20 h-20 object-contain rounded-lg' />
                            <button onClick={() => handleRemoveImage(index)} className='p-3 text-red-600 uppercase hover:opacity-65'>Delete</button>
                        </div>
                    ))
                }
                
                <button disabled={uploadingFiles} className='p-3 bg-[#439A86] text-white rounded-lg uppercase hover:bg-white border hover:border-[#439A86] hover:text-[#222E50] ease-in-out duration-200 disabled:opacity-75 disabled:hover:bg-[#439A86] disabled:hover:text-white disabled:hover:border disabled:border-none'>{uploadingFiles ? 'Wait Uploading Images...' : 'Create Listing'}</button>
            </div>

        </form>
    </main>
  );
}

export default CreateListing
