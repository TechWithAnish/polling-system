import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

function StudentPoll() {
  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('newPoll', (data) => {
      setPoll(data);
      setTimeLeft(60);
      const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
      return () => clearInterval(timer);
    });
    socket.on('updateResults', (results) => console.log('Results updated:', results)); // Placeholder
    socket.on('pollEnded', () => navigate('/student'));
    socket.on('kick', () => navigate('/student/kicked'));
    return () => {
      socket.off('newPoll');
      socket.off('updateResults');
      socket.off('pollEnded');
      socket.off('kick');
    };
  }, [navigate]);

  const handleSubmit = () => {
    if (selected && poll) {
      socket.emit('submitAnswer', { name: sessionStorage.getItem('name'), answer: selected });
      setSelected('');
    }
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <button className="mb-4 text-purple-600 hover:text-purple-800">+ Intervue Poll</button>
        <div className="bg-gray-200 p-4 rounded-lg mb-4">
          <p className="text-gray-800 font-semibold">Question 1 <span className="text-red-600">{timeLeft}</span></p>
          <p className="text-gray-600">{poll.question}</p>
          {poll.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`w-full text-left p-2 mb-2 rounded-lg ${selected === option ? 'bg-purple-600 text-white' : 'bg-white'}`}
            >
              {option}
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 mt-4"
            disabled={!selected}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentPoll;