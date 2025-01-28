"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, ChangeEvent, FormEvent, Suspense } from "react";

// Define types for car details
interface CarDetails {
  id: string;
  name: string;
  type: string;
  fuel_capacity: string;
  transmission: string;
  seating_capacity: number;
  price_per_day: string;
  image_url: string;
}

// Define types for form details
interface CardDetails {
  cardNumber: string;
  expirationDate: string;
  cardHolder: string;
  cvc: string;
}

interface MobileDetails {
  mobileNumber: string;
  accountHolderName: string;
}

const PaymentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carid = searchParams.get("id");

  // Define state with types
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expirationDate: "",
    cardHolder: "",
    cvc: "",
  });
  const [mobileDetails, setMobileDetails] = useState<MobileDetails>({
    mobileNumber: "",
    accountHolderName: "",
  });
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch car details on component mount
  useEffect(() => {
    if (carid) {
      fetch(`https://678cc7fcf067bf9e24e83478.mockapi.io/carrental?id=${carid}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setCarDetails(data[0]);
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

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // Handle card details change
  const handleCardDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: value,
    });
  };

  // Handle mobile details change
  const handleMobileDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMobileDetails({
      ...mobileDetails,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let details: CardDetails | MobileDetails;
    if (paymentMethod === "Credit Card") {
      if (cardDetails.cardNumber.length !== 16) {
        alert("Card number must be exactly 16 digits.");
        return;
      }
      details = cardDetails; // Assign card details
    } else if (paymentMethod === "JazzCash" || paymentMethod === "EasyPaisa") {
      if (!mobileDetails.mobileNumber.startsWith("+92") || mobileDetails.mobileNumber.length !== 13) {
        alert("Mobile number must start with +92 followed by 10 digits.");
        return;
      }
      if (!mobileDetails.accountHolderName) {
        alert("Account holder name is required.");
        return;
      }
      details = mobileDetails; // Assign mobile details
    } else {
      alert("Please select a valid payment method.");
      return;
    }

    // Store payment details in localStorage
    localStorage.setItem("paymentDetails", JSON.stringify({ paymentMethod, details }));
    localStorage.setItem("carDetails", JSON.stringify(carDetails));

    // Redirect to confirmation page
    router.push(`/Confirmation?id=${carid}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl font-bold">Loading car details...</div>;
  }

  if (!carDetails) {
    return <div className="flex justify-center items-center min-h-screen text-xl font-bold text-red-600">No car details found.</div>;
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Details</h1>
        <p className="text-gray-600 mb-6">
          Secure your car rental by completing your payment details below.
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Car Details</h2>
          <div className="gap-4 items-center">
            <img
              src={carDetails.image_url}
              alt={carDetails.name}
              className="object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = "/default-car-image.jpg";
              }}
            />
            <div>
              <p className="text-lg font-bold text-gray-800">{carDetails.name}</p>
              <p className="text-gray-600">Type: {carDetails.type}</p>
              <p className="text-gray-600">Price per Day: {carDetails.price_per_day}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
          <div className="space-y-3 mb-6">
            {[{ method: "Credit Card", img: "/visa.jpg" }, { method: "JazzCash", img: "/jazzcash.jpeg" }, { method: "EasyPaisa", img: "/easypaisa.png" }].map(({ method, img }) => (
              <label
                key={method}
                className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${
                  paymentMethod === method ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  className="hidden"
                  checked={paymentMethod === method}
                  onChange={() => handlePaymentMethodChange(method)}
                />
                <img src={img} alt={method} className="w-6 h-6" />
                <span className="text-gray-800">{method}</span>
              </label>
            ))}
          </div>

          {paymentMethod === "Credit Card" && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={cardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  maxLength={16}
                />
                <input
                  type="text"
                  name="expirationDate"
                  placeholder="Expiration Date (MM/YY)"
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={cardDetails.expirationDate}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="Card Holder Name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={cardDetails.cardHolder}
                  onChange={handleCardDetailsChange}
                />
                <input
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={cardDetails.cvc}
                  onChange={handleCardDetailsChange}
                />
              </div>
            </div>
          )}

          {(paymentMethod === "JazzCash" || paymentMethod === "EasyPaisa") && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mobile Details</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number (+92XXXXXXXXXX)"
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={mobileDetails.mobileNumber}
                  onChange={handleMobileDetailsChange}
                />
                <input
                  type="text"
                  name="accountHolderName"
                  placeholder="Account Holder Name"
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:border-blue-500"
                  value={mobileDetails.accountHolderName}
                  onChange={handleMobileDetailsChange}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Confirm and Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

const PaymentFormPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <PaymentForm />
  </Suspense>
);

export default PaymentFormPage;

