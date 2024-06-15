import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle'
import ListingItem from './ListingItem'
import ListingItemLoading from './ListingItemLoading'

function Home() {

  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])


  const [offerListingsLoading, setOfferListingsLoading] = useState(true)
  const [rentListingsLoading, setRentListingsLoading] = useState(true)
  const [saleListingsLoading, setSaleListingsLoading] = useState(true)


  SwiperCore.use([Navigation])


  useEffect(() => {

    const fetchOfferListings = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/listing/get?offer=true&limit=4`, {
        method: "GET",
        credentials: 'include' // Ensures cookies are sent with the request
      })
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          setOfferListings(data)
          setOfferListingsLoading(false)
          fetchRentListings()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const fetchRentListings = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/listing/get?type=rent&limit=4`, {
        method: "GET",
        credentials: 'include' // Ensures cookies are sent with the request
      })
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          setRentListings(data)
          setRentListingsLoading(false)
          fetchSaleListings()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const fetchSaleListings = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/listing/get?type=sale&limit=4`, {
        method: "GET",
        credentials: 'include' // Ensures cookies are sent with the request
      })
        .then((resp) => {
          return resp.json()
        })
        .then((data) => {
          setSaleListings(data)
          setSaleListingsLoading(false)
        })
        .catch((error) => {
          console.log(error)
        })
    }


    fetchOfferListings()

  }, []);



  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>

        <div className='text-gray-400 text-xs sm:text-sm'>
          RealEstate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>

        <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' >
          Let's get started...
        </Link>
      </div>


      <Swiper navigation>
        {offerListings && offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: 'cover', }} className='h-[500px]' >
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
            <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>Show more offers</Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {!offerListingsLoading && offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}

            {offerListingsLoading &&
              <>
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
              </>
            }
          </div>
        </div>


        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
            <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>Show more places for rent</Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {!rentListingsLoading && rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}

            {rentListingsLoading &&
              <>
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
              </>
            }
          </div>
        </div>


        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
            <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>Show more places for sale</Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {!saleListingsLoading && saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}

            {saleListingsLoading &&
              <>
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
                <ListingItemLoading />
              </>
            }
          </div>
        </div>
      </div>

    </div>
  )

}

export default Home
