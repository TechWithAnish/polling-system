import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

function TeacherPoll() {
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState({});
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('newPoll', (data) => setPoll(data));
    socket.on('updateResults', (data) => setResults(data));
    socket.on('pollEnded', () => navigate('/teacher'));
    socket.on('connection', (socketId) => {
      // Simulate participant name (replace with actual names if tracked)
      setParticipants(prev => [...prev, `User_${socketId.slice(-4)}`]);
    });
    return () => {
      socket.off('newPoll');
      socket.off('updateResults');
      socket.off('pollEnded');
      socket.off('connection');
    };
  }, [navigate]);

  const kickParticipant = (name) => {
    socket.emit('kick', name);
    setParticipants(participants.filter(p => p !== name));
  };

  const askNewQuestion = () => {
    socket.emit('createPoll', { question: '', options: [] }); // Reset or navigate
    navigate('/teacher');
  };

  if (!poll) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <button className="mb-4 text-purple-600 hover:text-purple-800">+ Intervue Poll</button>
        <div className="bg-gray-200 p-4 rounded-lg mb-4">
          <p className="text-gray-800 font-semibold">Current Poll: {poll.question}</p>
          <p className="text-gray-600">Time remaining: 60 seconds</p>
          {Object.entries(results).map(([option, count]) => (
            <div key={option} className="mb-2">
              <p>{option}: {count} votes</p>
            </div>
          ))}
        </div>
        <button
          onClick={askNewQuestion}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 mr-4"
        >
          Ask a new question
        </button>
        <button
          onClick={() => {/* Open chat logic */}}
          className="text-purple-600 hover:text-purple-800 mr-4"
        >
          Chat
        </button>
        <button
          onClick={() => {/* Open participants logic */}}
          className="text-purple-600 hover:text-purple-800"
        >
          Participants
        </button>
        {participants.length > 0 && (
          <div className="mt-4">
            <h3 className="text-gray-700">Participants</h3>
            {participants.map((name) => (
              <p key={name} className="text-gray-600">
                {name} <button onClick={() => kickParticipant(name)} className="text-red-600">Kick out</button>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherPoll;