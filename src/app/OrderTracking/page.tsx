"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// Define types for the car details
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

const MapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState<number>(0);
  const [geofenceAlert] = useState<string>("");
  const [maintenanceAlert] = useState<string>("");
  const [carDetails, setCarDetails] = useState<CarDetails | null>(null); // Typed state for car details
  const searchParams = useSearchParams();
  const carId = searchParams.get("id");

  console.log("Car ID from URL:", carId); // Debugging

  useEffect(() => {
    if (!carId) {
      console.error("No car ID found in the URL.");
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const response = await fetch(
          `https://678cc7fcf067bf9e24e83478.mockapi.io/carrental?id=${carId}`
        );
        const data = await response.json();
        console.log("API Response:", data); // Debugging
        if (data.length > 0) {
          setCarDetails(data[0]); // Set the first matching car
        } else {
          console.error("No car found with the given ID.");
        }
      } catch (error) {
        console.error("Failed to fetch car details:", error);
      }
    };

    fetchCarDetails();
  }, [carId]);

  useEffect(() => {
    if (!carDetails) return;

    const script = document.createElement("script");
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Use environment variable
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;

    script.onload = () => {
      console.log("Google Maps script loaded successfully!"); // Debugging
      if (typeof google !== "undefined") {
        const userLocation = { lat: 24.8607, lng: 67.0011 }; // User location (Karachi)
        const carLocation = { lat: 24.8934, lng: 67.0281 }; // Car location (SAYLANI Technical Training Center)

        console.log("User Location:", userLocation); // Debugging
        console.log("Car Location:", carLocation); // Debugging

        const map = new google.maps.Map(mapRef.current!, {
          zoom: 12,
          center: userLocation,
        });

        // User Location Marker
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "Your Location",
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        // Car Location Marker
        const carMarker = new google.maps.Marker({
          position: carLocation,
          map,
          title: "Your Car",
          icon: "http://maps.google.com/mapfiles/kml/shapes/cabs.png",
        });

        // Directions Service
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({
          map,
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: "#0000FF",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          },
        });

        directionsService.route(
          {
            origin: userLocation,
            destination: carLocation,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error(`Directions request failed due to ${status}`);
            }
          }
        );

        // Simulate Real-Time Tracking (Mock Data)
        const trackingInterval = setInterval(() => {
          const newCarLocation = {
            lat: carLocation.lat + Math.random() * 0.01 - 0.005,
            lng: carLocation.lng + Math.random() * 0.01 - 0.005,
          };

          // Update car marker position
          carMarker.setPosition(newCarLocation);

          // Simulate speed (random value between 0 and 120 km/h)
          const newSpeed = Math.floor(Math.random() * 120);
          setSpeed(newSpeed);
        }, 5000);

        // Cleanup interval on component unmount
        return () => {
          clearInterval(trackingInterval);
        };
      } else {
        console.error("Google Maps API script loaded, but `google` object is not available.");
      }
    };

    script.onerror = () => {
      console.error("Failed to load Google Maps script.");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [carDetails]);

  if (!carId) {
    return <div>Error: No car ID found in the URL. Please go back and select a car.</div>;
  }

  if (!carDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        {/* Order/Service Overview */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Order/Service Overview</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>Car Name:</span> <span className="font-bold">{carDetails.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span> <span className="font-bold">{carDetails.type}</span>
            </div>
            <div className="flex justify-between">
              <span>Fuel Capacity:</span> <span className="font-bold">{carDetails.fuel_capacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Transmission:</span> <span className="font-bold">{carDetails.transmission}</span>
            </div>
            <div className="flex justify-between">
              <span>Seating Capacity:</span> <span className="font-bold">{carDetails.seating_capacity}</span>
            </div>
            <div className="flex justify-between">
              <span>Price per Day:</span> <span className="font-bold">{carDetails.price_per_day}</span>
            </div>
          </div>
        </div>

        {/* Location Tracking */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Location Tracking</h2>
          <div ref={mapRef} className="w-full h-[500px] rounded-lg"></div>
          <div className="mt-4">
            <div className="flex justify-between">
              <span>Speed:</span> <span className="font-bold">{speed} km/h</span>
            </div>
            {geofenceAlert && (
              <div className="text-red-500">
                <span>{geofenceAlert}</span>
              </div>
            )}
            {maintenanceAlert && (
              <div className="text-yellow-600">
                <span>{maintenanceAlert}</span>
              </div>
            )}
          </div>
        </div>

        {/* Car Image */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">Car Image</h2>
          <img
            src={carDetails.image_url} // Use the image_url from the API
            alt={carDetails.name}
            className="mt-5 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const MapComponentPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MapComponent />
  </Suspense>
);

export default MapComponentPage;