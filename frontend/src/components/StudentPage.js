import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

function StudentPage() {
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      const enteredName = prompt('Enter your name');
      if (enteredName) {
        setName(enteredName);
        sessionStorage.setItem('name', enteredName);
        socket.emit('join', enteredName);
      }
    }

    socket.on('newPoll', (pollData) => {
      setPoll(pollData);
      setResults(null);
      setHasSubmitted(false);
      setTimeLeft(60);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('updateResults', (data) => {
      if (hasSubmitted) {
        setResults(data.results);
      }
    });

    socket.on('pollEnded', (finalResults) => {
      setResults(finalResults);
      setPoll(null);
      setHasSubmitted(false);
    });

    socket.on('results', (resultsData) => {
      setResults(resultsData);
    });

    socket.on('kicked', () => {
      alert('You have been kicked out by the teacher.');
      navigate('/student');
    });

    socket.on('error', (message) => {
      alert(message);
    });

    return () => {
      socket.off('newPoll');
      socket.off('updateResults');
      socket.off('pollEnded');
      socket.off('results');
      socket.off('kicked');
      socket.off('error');
    };
  }, [name, hasSubmitted, navigate]);

  const submitAnswer = (answer) => {
    if (name && !hasSubmitted) {
      socket.emit('submitAnswer', { name, answer });
      setHasSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Student Polling</h1>
        {name ? <p className="text-gray-600 mb-4">Welcome, {name}</p> : <p>Loading...</p>}
        {poll ? (
          <div className="mt-8">
            <p className="text-red-500 mb-4">Time left: {timeLeft} seconds</p>
            <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
            <div className="space-y-2">
              {poll.options.map((option) => (
                <button
                  key={option}
                  onClick={() => submitAnswer(option)}
                  disabled={hasSubmitted}
                  className={`w-full py-2 px-4 rounded ${hasSubmitted ? 'bg-gray-300' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : results ? (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <div className="space-y-2">
              {Object.entries(results).map(([option, count]) => {
                const total = Object.values(results).reduce((a, b) => a + b, 0);
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
        ) : (
          <p className="text-gray-600 mt-8">Waiting for a poll...</p>
        )}
      </div>
    </div>
  );
}

export default StudentPage;