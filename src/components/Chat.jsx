import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import AutoScrollContainer from './AutoScrollContainer';
import { BACKEND_URL } from '../constants';

const Chat = ({ user }) => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [windowId, setWindowId] = useState('');
  const {conversationId} = useParams();

  const socketRef = useRef(null);

  const initializeWebSocket = async () => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      const response = await axios.post('/chat/window/', { user: conversationId });
      console.log(response.data);
      setReceivedMessages(response.data.messages);
      const storedWindowId = localStorage.getItem('windowId');
      if (storedWindowId && response.data.id.toString() !== storedWindowId) {
        // If the stored windowId is different, close the previous WebSocket connection
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      }
      setWindowId(response.data.id.toString());
      localStorage.setItem('windowId', response.data.id.toString());

      // Establish WebSocket connection
      const socketUrl = `ws://${BACKEND_URL}/ws/chat/${response.data.id}/`;
      if (!socketRef.current) {
        socketRef.current = new WebSocket(socketUrl);
        socketRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data);
          setReceivedMessages((prevMessages) => [...prevMessages, data]);
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.token]);

  const sendMessage = () => {
    if (message.trim() !== '' && windowId !== '' && socketRef.current) {
      const data = {
        message: message,
        author: user.user.id.toString(),
        window: windowId,
      };
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(data));
        setMessage('');
      } else {
        console.error('WebSocket connection is not open.');
      }
    } else {
      console.error('WebSocket connection is not established.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    sendMessage();
  };

  return (
    <AutoScrollContainer>
    <div className="chat-window">
      <h1>My Window: {user.user.username}</h1>

      <div className="message-container">
        {receivedMessages.map((receivedMessage, index) => (
          <div key={index} className={"received-message " + (receivedMessage.author == user.user.id || receivedMessage.author == user.user.username ? 'own-message-wrapper' : '')}>
            <p className={"general-message " + (receivedMessage.author == user.user.id || receivedMessage.author == user.user.username ? 'own-message' : 'other-message')}>{receivedMessage.message}</p>
          </div>
        ))}
      </div>
      <div class="divider"></div>
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
    </AutoScrollContainer>
  );
};

export default Chat;
