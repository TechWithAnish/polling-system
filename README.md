# Live Polling System

Welcome to the Live Polling System, a real-time polling application I developed over the past month! This project allows users to create and participate in live polls with intuitive interfaces for both teachers and students. Built with modern web technologies, it offers seamless real-time updates, a clean design, and easy deployment.

## Features

- **Teacher Interface**: Create polls with customizable questions and multiple-choice options, view live results, and manage participants.
- **Student Interface**: Join polls with a unique name per session, submit answers, and see results in real-time or after a 60-second timeout.
- **Real-Time Updates**: Powered by Socket.io for instant poll creation, answer submission, and result broadcasting.
- **Poll History**: Teachers can review past polls and their results.
- **Responsive Design**: Clean, user-friendly interface with a purple accent theme, optimized for all devices.

## Technologies Used

- **Frontend**: React with React Router for navigation and Tailwind CSS for styling.
- **Backend**: Node.js with Express.js for the server and Socket.io for real-time communication.
- **Deployment**: Hosted on Render for free and scalable access.

## Getting Started

### Prerequisites
- Node.js (version 22.x recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/polling-system.git
   cd polling-system
   ```
2. Install backend dependencies:
   ```
   npm install
   ```
3. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```
4. Build the frontend:
   ```
   cd frontend
   npm run build
   cd ..
   ```

### Running the Application
1. Start the server:
   ```
   node server.js
   ```
2. Open your browser and go to `http://localhost:3001` (or the port specified in `server.js`).

## Deployment
This project is deployed on Render. Check it out live at [https://polling-system-app.onrender.com](https://polling-system-app.onrender.com) (replace with your actual deployed URL).

## Usage
- **Teachers**: Access the teacher interface to create a new poll by entering a question and at least two options, then monitor live results.
- **Students**: Join with a unique name, wait for a poll, submit an answer, and view the results.
- **Additional Features**: Teachers can kick students and view poll history (optional features implemented with extra time).

## Development Process
Over the past month, I focused on building a robust backend for real-time functionality, crafting a reactive frontend with React, and ensuring a smooth user experience. The project evolved from a basic poll system to include advanced features like poll history and participant management, all while maintaining a consistent purple-themed design.

## Contributing
This is a personal project, but feel free to fork it and submit pull requests! Suggestions for improvements are welcome.

## License
This project is open-source under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments
- Thanks to the open-source community for tools like React, Node.js, and Socket.io.
- Inspired by the need for interactive polling in educational settings.