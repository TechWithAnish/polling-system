import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

function TeacherPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    socket.on('newPoll', (pollData) => {
      setPoll(pollData);
      setResults({});
      setStudents([]);
    });

    socket.on('updateResults', (data) => {
      setResults(data.results);
      setStudents(data.students);
    });

    socket.on('pollEnded', (finalResults) => {
      setResults(finalResults);
      setPoll(null);
      setStudents([]);
    });

    socket.on('error', (message) => {
      alert(message);
    });

    return () => {
      socket.off('newPoll');
      socket.off('updateResults');
      socket.off('pollEnded');
      socket.off('error');
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createPoll = (e) => {
    e.preventDefault();
    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (question && validOptions.length >= 2) {
      socket.emit('createPoll', { question, options: validOptions });
      setQuestion('');
      setOptions(['', '', '', '']);
    } else {
      alert('Please enter a question and at least two options');
    }
  };

  const kickStudent = (name) => {
    socket.emit('kick', name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Teacher Polling</h1>
        {!poll ? (
          <form onSubmit={createPoll} className="w-full max-w-md">
            <div className="mb-4 text-left">
              <label className="block text-gray-700">Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            {options.map((option, index) => (
              <div key={index} className="mb-4 text-left">
                <label className="block text-gray-700">Option {index + 1}:</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            ))}
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Create Poll
            </button>
          </form>
        ) : (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Current Poll: {poll.question}</h2>
            <p className="text-gray-600 mb-4">Time remaining: 60 seconds</p>
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
            {students.length > 0 && (
              <div className="mt-4">
                <h3 className="text-gray-700">Students who answered:</h3>
                <ul className="list-disc pl-5">
                  {students.map((student) => (
                    <li key={student} className="text-gray-600">
                      {student}
                      <button onClick={() => kickStudent(student)} className="ml-2 text-red-500">Kick</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Link to="/teacher">
              <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Ask a new question</button>
            </Link>
            <Link to="/teacher/history">
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">View Poll History</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherPage;