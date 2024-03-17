import React from 'react'
import { Link } from 'react-router-dom'

function HeaderAuth() {
  return (
    <header className='shadow-sm'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
            <div className="sm:ml-16">
                <span className="text-xl sm:text-2xl">Welcome to </span> 
                <span className="text-2xl sm:text-3xl text-[#222E50] font-bold">RealEstate</span>
            </div> 

            <ul className='flex gap-4'>
                <Link to='/'>
                    <li className='text-[#222E50] hover:underline cursor-pointer'>Home</li>
                </Link>

                <Link to='/about'>
                    <li className='text-[#222E50] hidden sm:inline hover:underline cursor-pointer'>About</li>
                </Link>

            </ul>
        </div>
    </header>
  )
}

export default HeaderAuth
