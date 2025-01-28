import React from "react";
import { IoMdStarHalf } from "react-icons/io";
import { MdOutlineStar } from "react-icons/md";

const Reviews = () => {
  const reviews = [
    {
      name: "Alex Stanton",
      position: "CEO at Bukalapak",
      review:
        "We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      date: "21 July 2022",
      rating: 4,
    },
    {
      name: "Skylar Dias",
      position: "CEO at Amazon",
      review:
        "We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite.",
      date: "20 July 2022",
      rating: 4,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <span className="px-2 py-1 bg-blue-500 text-white text-sm rounded-full">
          {reviews.length}
        </span>
      </div>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row justify-between border-b pb-4"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div>
                <h3 className="text-sm font-bold">{review.name}</h3>
                <p className="text-xs text-gray-500">{review.position}</p>
                <p className="text-sm mt-2">{review.review}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-500">{review.date}</p>
              <div className="mt-2 flex">
                
                <div  className="flex space-x-1 text-yellow-500">
                      <MdOutlineStar size={20}/>
                      <MdOutlineStar size={20}/>
                      <MdOutlineStar size={20}/>
                      <MdOutlineStar size={20}/>
                      <IoMdStarHalf size={20}/>
                
                
                      </div>
                 
              </div>
            </div>
          </div>
        ))}
      </div>
  
    </div>
  );
};

export default Reviews;
