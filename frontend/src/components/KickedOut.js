import React from 'react';
import { Link } from 'react-router-dom';

function KickedOut() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <button className="mb-4 text-purple-600 hover:text-purple-800">+ Intervue Poll</button>
        <h1 className="text-3xl font-bold text-purple-600 mb-4">YOU'VE BEEN KICKED OUT!</h1>
        <p className="text-gray-600 mb-4">Looks like the teacher has removed you from the poll system. Please try again sometime.</p>
        <Link to="/student">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Join Poll</button>
        </Link>
      </div>
    </div>
  );
}

export default KickedOut;