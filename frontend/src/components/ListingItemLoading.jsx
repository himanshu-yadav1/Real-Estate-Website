import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

function ListingItemLoading() {
    return (
        <div className='flex flex-grow shadow-md overflow-hidden rounded-lg w-full max-w-[330px] sm:w-[250px] '>
            <div className='w-full'>
                <div className="bg-neutral-400/50 h-[320px] sm:h-[220px] w-full object-cover animate-pulse"></div>


                <div className='p-3 flex flex-col gap-2 w-full h-[204px]'>
                    <div className='bg-neutral-400/50 w-4/5 h-[30px] animate-pulse rounded-md'></div>

                    <div className='flex gap-1'>
                        <div className='bg-neutral-400/50 w-1/12 h-[17px] animate-pulse rounded-md'></div>
                        <div className='bg-neutral-400/50 w-2/5 h-[17px] animate-pulse rounded-md'></div>
                    </div>

                    <div className='bg-neutral-400/50 w-full h-[42px] animate-pulse rounded-md'></div>

                    <div className='bg-neutral-400/50 w-3/5 h-[25px] animate-pulse rounded-md mt-2'></div>

                    <div className='flex gap-4'>
                        <div className='bg-neutral-400/50 w-2/6 h-[17px] animate-pulse rounded-md'></div>
                        <div className='bg-neutral-400/50 w-2/6 h-[17px] animate-pulse rounded-md'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingItemLoading