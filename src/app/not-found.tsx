'use client'; // Ensure the component runs on the client side

import React from 'react';
import { FaCar } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Using next/navigation for routing in App Directory

const NotFoundPage: React.FC = () => {
  
  const router = useRouter(); // Initialize the router

  const handleGoHome = () => {
    
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-8">
      <div className="text-center text-blue-500 py-12 sm:py-16 max-w-3xl w-full mx-auto">
        {/* Main Header */}
        <div className="text-6xl sm:text-8xl font-extrabold text-blue-500 leading-none mb-4 sm:mb-6">
          Oops!
        </div>

        {/* Description */}
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-800">
          Looks like you&apos;ve taken a wrong turn. Let&apos;s get back on track!
        </h2>

        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:max-w-xl mx-auto">
          We couldn&apos;t find the page you&apos;re looking for.
        </p>

        {/* Car Icon */}
        <div className="flex justify-center relative mb-8 sm:mb-12">
          <div className="absolute top-0 transform -translate-x-1/2 left-1/2 animate-bounce">
            <FaCar className="w-20 sm:w-24 h-20 sm:h-24 text-blue-500 -ml-12" />
          </div>
        </div>

        {/* Go Home Button */}
        <button
          onClick={handleGoHome}
          className="inline-block text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700 mt-12 rounded-full px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
