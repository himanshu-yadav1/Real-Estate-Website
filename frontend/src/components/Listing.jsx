import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

function Listing() {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listingData, setListingData] = useState(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            setError(false)

            const listingId = params.listingId

            fetch(`/api/v1/listing/get/${listingId}`)
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
                </div>
            )
        }
    </main>
  )
}

export default Listing
