import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getUserInfo } from '../features/auth/authSlice';

const MessagingInbox = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Fetch messages when the component mounts
    axios.get(`http://localhost:8000/messages/${userInfo.id}/`)
      .then((response) => {
        const receivedMessages = response.data;
        setMessages(receivedMessages);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });

    // Fetch users when the component mounts
    axios.get(`http://localhost:8000/user/`)
      .then((response) => {
        const allUsers = response.data;
        setUsers(allUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });

    dispatch(getUserInfo());
  }, [userInfo.id, dispatch]);

  const handleCreateMessage = () => {
    setShowUserMenu(true);
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setShowUserMenu(false);
    // Perform any other action like opening a compose message modal here
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = () => {
    // Send message logic here
    console.log(`Sending message to user ${selectedUser}: ${messageText}`);
    // Reset message text
    setMessageText('');
  };

  return (
    <div className="container messaging__container">
      <h1 className='main__title'>{selectedUser ? `Messaging ${users.find(user => user.id === selectedUser).username}` : `Your Messaging Inbox`}</h1>
      <div className="messages">
        {messages.length === 0 ? (
          <p>Inbox Empty</p>
        ) : (
          messages.map(message => (
            <div key={message.id} className="message">
              <p>From: {message.sender_name}</p>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>
      {showUserMenu && (
        <div>
          <p>Select a user to message:</p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} onClick={() => handleUserSelect(user.id)} style={{ textAlign: 'center', color: 'white' }}>
                <a href="#" style={{ color: 'white' }}>{user.first_name} {user.last_name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedUser ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <textarea 
            value={messageText} 
            onChange={handleInputChange} 
            style={{ width: '80%', height: '200px', padding: '10px', borderRadius: '5px', fontSize: '16px' }}
          />
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button className="btn" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn" onClick={handleCreateMessage}>Create Message</button>
        </div>
      )}
    </div>
  );
 };  

export default MessagingInbox;
