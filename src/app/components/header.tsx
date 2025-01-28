import React from 'react';


import { IoIosNotifications } from "react-icons/io";


import Acount from './acount';
import Link from 'next/link';
import SearchBar from './searchbar';
import { FaRegHeart } from 'react-icons/fa6';




export default function Header() {
  return (
    <div className='w-full  h-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-8 border-b-2 border-b-[#e7eef6]'>
      <div className="first flex flex-col md:flex-row items-center gap-4 md:gap-16">
        <Link href="/">
        <h1 className='text-[#3360e9] text-4xl font-bold'>MORENT</h1></Link>
        <div className="input relative w-full md:w-auto">
          <SearchBar/>
          </div>
      </div>
      <div className="icons flex items-center gap-4">
        <Link href="/wishlist" aria-label="Go to Wishlist">
        <FaRegHeart  className="text-gray-500 cursor-pointer" size={28} /></Link>
        <IoIosNotifications className="text-gray-500 cursor-pointer" size={28} />
       
       <Acount  />
    
      
      
   
        
      </div>
    </div>
  );
}



