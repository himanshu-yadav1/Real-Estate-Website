import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';

function Listing() {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listingData, setListingData] = useState(null)
    const [error, setError] = useState(false)
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            setError(false)

            const listingId = params.listingId

            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/listing/get/${listingId}`, {
                method: "GET",
                credentials: 'include' // Ensures cookies are sent with the request
            })
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                if(data.success === false){
                    setError(true)
                    return
                }

                setListingData(data)
                setError(false)
            })
            .catch((error) => {
                console.log(error)
                setError(true)
            })
        }

        fetchListing()
    }, [])

  return (
    <main>
        {
            error &&
            <p className="text-xl text-center mt-5 mx-5">Something went wrong while fetching listing</p>
        }

        {
            listingData && !error && (
                <div>
                    <Swiper navigation>
                        {listingData.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[60vh] mt-1 w-[100vw] md:w-[60vw] mx-auto rounded-xl' style={{ 
                                        background: `url(${url}) center no-repeat`, 
                                        backgroundSize: 'cover',
                                    }}
                                >
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                        className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>

                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}

                    <div className='flex flex-col w-[100vw] md:w-[60vw] mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listingData.title} - ₹
                            {listingData.offer ? listingData.discountedPrice : listingData.regularPrice}
                            {listingData.type === 'rent' ? ' / month' : ''}
                        </p>

                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listingData.address}
                        </p>
                        
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listingData.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>

                            {listingData.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    <span>₹ {+listingData.regularPrice - +listingData.discountedPrice}</span>
                                    <span> Discount</span>
                                </p>
                            )}
                        </div>

                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listingData.description}
                        </p>

                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listingData.bedrooms > 1 ? `${listingData.bedrooms} beds ` : `${listingData.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listingData.bathrooms > 1 ? `${listingData.bathrooms} baths ` : `${listingData.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listingData.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listingData.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                    </div>

                </div>
            )
        }
    </main>
  )
}

export default Listing
