"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import jsPDF from "jspdf";

interface PaymentDetails {
  paymentMethod: string;
  details: {
    cardNumber?: string;
    expirationDate?: string;
    cardHolder?: string;
    cvc?: string;
    mobileNumber?: string;
    accountHolderName?: string;
  };
}

interface BillingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface CarDetails {
  id: string;
  name: string;
  type: string;
  price_per_day: string;
  image_url: string;
}

const OrderSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carid = searchParams.get("id"); // Get the car ID from the URL

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [billingDetails, setBillingDetails] = useState<BillingDetails | null>(null);
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null); // State to store car details
  const [loading, setLoading] = useState(true); // Loading state
  const [isClient, setIsClient] = useState(false); // State to check if the component is running on the client side

  useEffect(() => {
    setIsClient(true); // Set isClient to true once the component is mounted on the client side
  }, []);

  // Fetch payment and billing details from localStorage
  useEffect(() => {
    if (isClient) {
      const storedPaymentDetails = localStorage.getItem("paymentDetails");
      const storedBillingDetails = localStorage.getItem("billingDetails");

      if (storedPaymentDetails && storedBillingDetails) {
        setPaymentDetails(JSON.parse(storedPaymentDetails));
        setBillingDetails(JSON.parse(storedBillingDetails));
      } else {
        router.push("/PaymentForm");
      }
    }
  }, [router, isClient]);

  // Fetch car details from the API
  useEffect(() => {
    if (isClient && carid) {
      fetch(`https://678cc7fcf067bf9e24e83478.mockapi.io/carrental?id=${carid}`)
        .then((response) => response.json())
        .then((data) => {
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
  }, [carid, isClient]);

  const handleGoBack = () => {
    router.push("/");
  };

  // Function to generate and download the order summary as a PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Order Summary", 10, 10);

    // Add car details
    doc.setFontSize(12);
    doc.text("Car Details:", 10, 20);
    doc.text(`- Name: ${carDetails?.name || "N/A"}`, 15, 30);
    doc.text(`- Type: ${carDetails?.type || "N/A"}`, 15, 40);
    doc.text(`- Price per Day: ${carDetails?.price_per_day || "N/A"}`, 15, 50);

    // Add payment details
    doc.text("Payment Details:", 10, 60);
    doc.text(`- Method: ${paymentDetails?.paymentMethod || "N/A"}`, 15, 70);
    if (paymentDetails?.paymentMethod === "Credit Card") {
      doc.text(`- Card Number: ${paymentDetails?.details?.cardNumber || "N/A"}`, 15, 80);
      doc.text(`- Expiration Date: ${paymentDetails?.details?.expirationDate || "N/A"}`, 15, 90);
      doc.text(`- Card Holder: ${paymentDetails?.details?.cardHolder || "N/A"}`, 15, 100);
      doc.text(`- CVC: ${paymentDetails?.details?.cvc || "N/A"}`, 15, 110);
    } else {
      doc.text(`- Mobile Number: ${paymentDetails?.details?.mobileNumber || "N/A"}`, 15, 80);
      doc.text(`- Account Holder Name: ${paymentDetails?.details?.accountHolderName || "N/A"}`, 15, 90);
    }

    // Add billing details
    doc.text("Billing Details:", 10, 120);
    doc.text(`- Full Name: ${billingDetails?.fullName || "N/A"}`, 15, 130);
    doc.text(`- Email: ${billingDetails?.email || "N/A"}`, 15, 140);
    doc.text(`- Address: ${billingDetails?.address || "N/A"}`, 15, 150);
    doc.text(`- City: ${billingDetails?.city || "N/A"}`, 15, 160);
    doc.text(`- Zip Code: ${billingDetails?.zipCode || "N/A"}`, 15, 170);

    // Save the PDF
    doc.save("order-summary.pdf");
  };

  if (!isClient || !paymentDetails || !billingDetails || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">OrderSummary</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Thank you for your payment! Your order has been successfully processed.
        </p>

        {/* Car Details */}
        {carDetails ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Car Details</h3>
            <div className=" items-center space-x-4">
              <img
                src={carDetails.image_url}
                alt={carDetails.name}
                className=" mt-2 mb-5 object-cover rounded-lg"
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
        ) : (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Car Details</h3>
            <p className="text-sm text-red-500">No car details found.</p>
          </div>
        )}

        {/* Payment Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p className="text-sm text-gray-700">
            <strong>Payment Method:</strong> {paymentDetails.paymentMethod}
          </p>
          {paymentDetails.paymentMethod === "Credit Card" && (
            <>
              <p className="text-sm text-gray-700">
                <strong>Card Number:</strong> {paymentDetails.details.cardNumber}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Expiration Date:</strong> {paymentDetails.details.expirationDate}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Card Holder:</strong> {paymentDetails.details.cardHolder}
              </p>
              <p className="text-sm text-gray-700">
                <strong>CVC:</strong> {paymentDetails.details.cvc}
              </p>
            </>
          )}
          {(paymentDetails.paymentMethod === "JazzCash" || paymentDetails.paymentMethod === "EasyPaisa") && (
            <>
              <p className="text-sm text-gray-700">
                <strong>Mobile Number:</strong> {paymentDetails.details.mobileNumber}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Account Holder Name:</strong> {paymentDetails.details.accountHolderName}
              </p>
            </>
          )}
        </div>

        {/* Billing Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
          <p className="text-sm text-gray-700">
            <strong>Full Name:</strong> {billingDetails.fullName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Email:</strong> {billingDetails.email}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Address:</strong> {billingDetails.address}
          </p>
          <p className="text-sm text-gray-700">
            <strong>City:</strong> {billingDetails.city}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Zip Code:</strong> {billingDetails.zipCode}
          </p>
        </div>

        {/* Go Back, Tracking, and Download Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleGoBack}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Go Back to Home
          </button>
          <Link href={`/OrderTracking?id=${carid}`}>
            <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300">
              Track Order
            </button>
          </Link>
          <button
            onClick={handleDownloadPDF}
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderSummaryPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderSummary />
  </Suspense>
);

export default OrderSummaryPage;