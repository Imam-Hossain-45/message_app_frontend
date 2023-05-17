import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import LoginForm from './components/LoginForm';
import Conversations from './components/Conversations';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={user ? <Conversations user={user} /> : <LoginForm setUser={setUser} />}
          />
          {user && <Route path="/chat/:conversationId" element={<Chat user={user} />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
