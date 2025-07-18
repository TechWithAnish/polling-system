import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Live Polling System</h1>
        <p className="text-gray-600 mb-8">Please select your role</p>
        <div className="space-x-4">
          <Link to="/student">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Continue as Student</button>
          </Link>
          <Link to="/teacher">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Continue as Teacher</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;