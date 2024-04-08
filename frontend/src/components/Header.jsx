import { Link, useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

function Header() {

    const {currentUser} = useSelector(state => state.user)

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm', searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    };
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }

    }, [location.search]);
    

    return (
        <header className='bg-[#439A86] shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3 sm:p-4'>
                <Link to='/'>
                    <h1 className='text-[#222E50] font-bold text-2xl sm:text-3xl'>RealEstate</h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-[#BCD8C1] p-2 rounded-lg flex items-center">
                    <input type="text" placeholder='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className='text-[#222E50] w-32 sm:w-64 bg-transparent focus:outline-none'/>
                    <button>
                        <FaSearch className='text-[#222E50]'/>
                    </button>
                </form>

                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className='text-[#222E50] hidden sm:inline hover:underline cursor-pointer'>Home</li>
                    </Link>

                    <Link to='/about'>
                        <li className='text-[#222E50] hidden sm:inline hover:underline cursor-pointer'>About</li>
                    </Link>

                    <Link to='/profile'>
                        {currentUser ? 
                            (
                                <img className='rounded-full w-7 h-7 object-cover ml-5' src={currentUser.user.avatar} alt='profile' />
                            ) : 

                            (
                                <li className='text-[#222E50] hover:underline cursor-pointer'>Sign In</li>
                            )
                        }
                    </Link>
                </ul>

            </div>
        </header>
    )
}

export default Header
