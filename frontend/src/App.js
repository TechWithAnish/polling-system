import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import StudentPage from './components/StudentPage';
import TeacherPage from './components/TeacherPage';
import PollHistory from './components/PollHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/teacher/history" element={<PollHistory />} />
      </Routes>
    </Router>
  );
}

export default App;