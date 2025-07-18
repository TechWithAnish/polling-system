const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Handle all routes with index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// In-memory storage
let currentPoll = null;
let answers = new Map();
let students = new Map(); // socket.id -> name
let pastPolls = [];
let timer = null;

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (name) => {
    students.set(socket.id, name);
  });

  if (currentPoll) {
    socket.emit('newPoll', currentPoll);
  }

  socket.on('createPoll', (pollData) => {
    if (currentPoll) {
      socket.emit('error', 'A poll is already active');
      return;
    }
    currentPoll = { ...pollData, startTime: Date.now() };
    answers.clear();
    if (timer) clearTimeout(timer);
    io.emit('newPoll', currentPoll);
    timer = setTimeout(() => {
      const finalResults = getResults();
      io.emit('pollEnded', finalResults);
      pastPolls.push({ question: currentPoll.question, options: currentPoll.options, results: finalResults });
      currentPoll = null;
      timer = null;
    }, 60000);
  });

  socket.on('submitAnswer', ({ name, answer }) => {
    if (!currentPoll) {
      socket.emit('error', 'No active poll');
      return;
    }
    if (answers.has(name)) {
      socket.emit('error', 'You have already submitted an answer');
      return;
    }
    answers.set(name, answer);
    io.emit('updateResults', { results: getResults(), students: Array.from(answers.keys()) });
    socket.emit('results', getResults());
  });

  socket.on('kick', (name) => {
    for (let [socketId, studentName] of students) {
      if (studentName === name) {
        io.to(socketId).emit('kicked');
        answers.delete(name);
        io.emit('updateResults', { results: getResults(), students: Array.from(answers.keys()) });
        break;
      }
    }
  });

  socket.on('getPastPolls', () => {
    socket.emit('pastPolls', pastPolls);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    students.delete(socket.id);
  });
});

function getResults() {
  const results = {};
  if (currentPoll) {
    currentPoll.options.forEach(option => {
      results[option] = 0;
    });
    answers.forEach(answer => {
      if (results[answer] !== undefined) {
        results[answer]++;
      }
    });
  }
  return results;
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});