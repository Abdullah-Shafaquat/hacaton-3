"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface PaymentDetails {
  paymentMethod: string;
  details?: {
    cardHolder?: string;
    accountHolderName?: string;
  };
}

interface CarDetails {
  image_url: string;
  name: string;
  type: string;
  price_per_day: string;
}

const Confirmation: React.FC = () => {
  const searchParams = useSearchParams();
  const carid = searchParams.get("id"); // Get the car ID from the URL

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Fetch payment and car details from localStorage
  useEffect(() => {
    const storedPaymentDetails = localStorage.getItem("paymentDetails");
    const storedCarDetails = localStorage.getItem("carDetails");

    if (storedPaymentDetails && storedCarDetails) {
      setPaymentDetails(JSON.parse(storedPaymentDetails));
      setCarDetails(JSON.parse(storedCarDetails));
    }

    setLoading(false);
  }, []);

  const handleFinish = () => {
    // Redirect to BillingInfo page
    router.push(`/BillingInfo?id=${carid}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!paymentDetails || !carDetails) {
    return <div className="flex justify-center items-center min-h-screen">No details found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Confirmation</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your payment has been processed successfully.
        </p>

        {/* Display Car Details */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Car Details</h3>
          <div className="items-center space-x-4">
            <img
              src={carDetails.image_url}
              alt={carDetails.name}
              className="object-cover rounded-lg mt-3 mb-4"
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

        {/* Display Payment Details */}
        <div>
          <h3 className="text-md font-semibold mb-2">Payment Details</h3>
          <p className="text-sm text-gray-700">
            <strong>Payment Method:</strong> {paymentDetails.paymentMethod}
          </p>
          {paymentDetails.details && (
            <>
              {paymentDetails.paymentMethod === "Credit Card" && (
                <p className="text-sm text-gray-700">
                  <strong>Card Holder:</strong> {paymentDetails.details.cardHolder}
                </p>
              )}
              {(paymentDetails.paymentMethod === "JazzCash" ||
                paymentDetails.paymentMethod === "EasyPaisa") && (
                <p className="text-sm text-gray-700">
                  <strong>Account Holder:</strong> {paymentDetails.details.accountHolderName}
                </p>
              )}
            </>
          )}
        </div>

        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleFinish}
        >
          Next: Billing Information
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
