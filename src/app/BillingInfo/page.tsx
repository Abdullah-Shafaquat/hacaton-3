"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";

// Define types for billing details
interface BillingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

// Define types for car details
interface CarDetails {
  id: string;
  name: string;
  type: string;
  price_per_day: string;
  image_url: string;
}

const BillingInfo: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carid = searchParams.get("id"); // Get the car ID from the URL

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [carDetails, setCarDetails] = useState<CarDetails | null>(null); // State to store car details
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch car details from the API
  useEffect(() => {
    if (carid) {
      fetch(`https://678cc7fcf067bf9e24e83478.mockapi.io/carrental?id=${carid}`)
        .then((response) => response.json())
        .then((data: CarDetails[]) => {
          if (data.length > 0) {
            setCarDetails(data[0]); // Extract the first item from the array
          } else {
            console.error("No car found with the given ID");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching car details:", error);
          setLoading(false);
        });
    }
  }, [carid]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Store billing details in localStorage
    localStorage.setItem("billingDetails", JSON.stringify(billingDetails));

    // Redirect to the Order Summary page with the carid
    router.push(`/OrderSummary?id=${carid}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
        <p className="text-sm text-gray-500 mb-6">
          Please enter your billing information to proceed.
        </p>

        {/* Car Details */}
        {carDetails && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Car Details</h3>
            <div className="items-center space-x-4">
              <img
                src={carDetails.image_url}
                alt={carDetails.name}
                className="mt-2 mb-3 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback image if the original image fails to load
                  e.currentTarget.src = "/default-car-image.jpg";
                }}
              />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Car Name:</strong> {carDetails.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {carDetails.type}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Price per Day:</strong> {carDetails.price_per_day}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={billingDetails.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={billingDetails.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={billingDetails.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={billingDetails.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={billingDetails.zipCode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-6"
          >
            Next: Order Summary
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillingInfo;
