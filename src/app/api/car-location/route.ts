import { NextApiRequest, NextApiResponse } from 'next';

interface CarLocation {
  lat: number;
  lng: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Mock car locations (replace with real data from your database)
  const carLocations: { [key: string]: CarLocation } = {
    '1': { lat: 37.7749, lng: -122.4194 }, // San Francisco
    '2': { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    '3': { lat: 40.7128, lng: -74.006 },   // New York
  };

  const location = carLocations[id as string] || { lat: 0, lng: 0 };

  res.status(200).json({ location });
}