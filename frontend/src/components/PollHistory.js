import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

function PollHistory() {
  const [pastPolls, setPastPolls] = useState([]);

  useEffect(() => {
    socket.emit('getPastPolls');
    socket.on('pastPolls', (data) => {
      setPastPolls(data);
    });
    return () => socket.off('pastPolls');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Poll History</h1>
        {pastPolls.map((poll, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
            <div className="space-y-2">
              {Object.entries(poll.results).map(([option, count]) => {
                const total = Object.values(poll.results).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total * 100).toFixed(1) : 0;
                return (
                  <div key={option} className="mb-2">
                    <p>{option}: {count} votes ({percentage}%)</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <Link to="/teacher">
          <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Back</button>
        </Link>
      </div>
    </div>
  );
}

export default PollHistory;