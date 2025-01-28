'use client'
import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard: React.FC = () => {
  // Line chart data
  const lineData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Rentals Over Time',
        data: [10, 20, 30, 25, 40, 50, 60, 55, 70, 80, 65, 90],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        tension: 0.4,
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: [
      'Gasoline',
      'Diesel',
      'Sport',
      'Electric',
      'Sedan',
      'SUV',
      'Hatchback',
      'Hybrid',
    ],
    datasets: [
      {
        data: [15, 10, 12, 8, 20, 18, 10, 7],
        backgroundColor: [
          '#FF6F61',
          '#6B5B95',
          '#88B04B',
          '#F7CAC9',
          '#92A8D1',
          '#034F84',
          '#F7786B',
          '#C94C4C',
        ],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-12">
      {/* Dashboard Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Gain insights into rental trends and car availability.
        </p>
      </div>

      {/* Chart Section */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Rentals Over Time
          </h1>
          <div className="h-96">
            <Line data={lineData} />
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <h1 className="text-xl font-semibold text-gray-700 text-center mb-4">
            Car Availability by Type
          </h1>
          <div className="h-96">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
