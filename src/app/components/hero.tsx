"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { faGasPump } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdPeopleOutline } from "react-icons/md";

import { useEffect, useState } from "react";

import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useWishlist } from "../context/WishlistContext";

import BookingForm from "./pick&drops";
import AnalyticsDashboard from "../AnalyticsDashboard/page";


export default function Hero() {

  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State for skeleton loading


  type Car = {
    id: number;
    name: string;
    type: string;
    fuel_capacity: string;
    transmission: string;
    seating_capacity: string;
    price_per_day: string;
    image_url: string;
    tags?: string[]; // Optional field
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("https://678cc7fcf067bf9e24e83478.mockapi.io/carrental");
        const data: Car[] = await response.json();
        setTimeout(() => {
          setCars(data.slice(0, 12)); // Limit to 12 cars
          setIsLoading(false); // Stop skeleton loader once data is fetched
        }, 1500); // Simulating a delay for skeleton loader
      } catch (error) {
        console.error("Error fetching cars:", error);
        setIsLoading(false); // Stop skeleton even if there's an error
      }
    };

    fetchCars();
  }, []);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="bg-[#f6f7f9] p-4 sm:p-6 lg:p-20 flex flex-col gap-10 font-[family-name:var(--font-geist-sans)] mt-[-0.5cm]">
      <section className="w-full flex flex-wrap sm:flex-nowrap gap-4 justify-center items-center">
      <img
  src="/bg2.png"
  alt="Background 1"
  className="w-full sm:w-1/2 h-auto object-cover"
  width="600"  
  height="400" 
/>
<Image
  src="/bg1.png"
  alt="Background 2"
  className="w-full sm:w-1/2 h-auto object-cover"
  width="600"  
  height="400" 
/>
        
      </section>

      <section className="px-4 sm:px-8 lg:px-16">
        <BookingForm />
      </section>

      <section className="popular w-full flex flex-col gap-4">
        <div className="first w-full flex items-center justify-between">
          <h1 className="text-gray-500 font-bold text-xl md:text-4xl">Popular Cars</h1>
          <Link href={"/morecars"}>
            <h1 className="text-[#3563e9] font-bold hover:underline decoration-[#3563e9]">
              View All
            </h1>
          </Link>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card
                key={index}
                className="w-full max-w-[304px] mx-auto h-auto animate-pulse flex flex-col justify-between bg-gray-300"
              >
                <CardHeader>
                  <CardTitle className="bg-gray-400 h-6 w-3/4 rounded-md"></CardTitle>
                  <CardDescription className="bg-gray-400 h-4 w-1/2 rounded-md mt-2"></CardDescription>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                  <div className="bg-gray-400 h-[150px] w-full rounded-md"></div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-400 h-4 w-10 rounded-md"></div>
                    <div className="bg-gray-400 h-4 w-10 rounded-md"></div>
                    <div className="bg-gray-400 h-4 w-10 rounded-md"></div>
                  </div>
                </CardContent>
                <CardFooter className="w-full flex items-center justify-between">
                  <div className="bg-gray-400 h-6 w-20 rounded-md"></div>
                  <div className="bg-gray-400 h-6 w-20 rounded-md"></div>
                </CardFooter>
              </Card>
            ))
          : cars.map((car) => (
              <div key={car.id}>
                <Card className="w-full max-w-[304px] mx-auto h-auto flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="w-full flex items-center justify-between">
                      {car.name}
                      <button
                        onClick={() =>
                          wishlist.includes(car.id)
                            ? removeFromWishlist(car.id)
                            : addToWishlist(car.id)
                        }
                        className="relative z-10 p-1 rounded-full bg-white" aria-label="add to Wishlist"
                      >
                        {wishlist.includes(car.id) ? (
                          <FaHeart size={20} className="text-red-500" />
                        ) : (
                          <FaRegHeart size={20} className="text-gray-500" />
                        )}
                      </button>
                    </CardTitle>
                    <CardDescription>{car.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full flex flex-col items-center justify-center gap-4">
                    <Image
                      src={car.image_url}
                      alt={car.name}
                      width={220}
                      height={68}
                    />
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        <FontAwesomeIcon
                          icon={faGasPump}
                          className="text-gray-400"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span className="md:text-sm text-xs flex">{car.fuel_capacity}</span>
                      </div>
                      <div className="flex">
                        <FontAwesomeIcon
                          icon={faGasPump}
                          className="text-gray-400"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <span className="md:text-sm text-xs flex">{car.transmission}</span>
                      </div>
                      <div className="flex">
                        <MdPeopleOutline size={30} className="text-gray-400" />
                        <span className="md:text-sm text-xs flex">{car.seating_capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="w-full flex items-center justify-between">
                    <p>{car.price_per_day}</p>
                    <button >
                      <Link href={`/morecars/id?id=${car.id}`} className="bg-[#3563e9] p-2 text-white rounded-md">Rent Now</Link>
                    </button>
                  </CardFooter>
                </Card>
              </div>
            ))}
      </div>
      <div className="flex justify-center items-center">
        <button >
          <Link href="/morecars" className="bg-[#3563e9] hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 w-52">
            More Cars
          </Link>
        </button>
      </div>
      <AnalyticsDashboard/>
    </div>
  );
}
