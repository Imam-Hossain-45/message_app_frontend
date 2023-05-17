import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Conversations({ user }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        const response = await axios.get('/chat/users/');
        setConversations(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, [user]);

  return (
    <div>
      <h1>Conversations</h1>
      {conversations.map((conversation) => (
        <div key={conversation.id} id={conversation.id}>
          <Link to={`/chat/${conversation.id}`}>{conversation.username}</Link>
        </div>
      ))}
    </div>
  );
}

export default Conversations;
