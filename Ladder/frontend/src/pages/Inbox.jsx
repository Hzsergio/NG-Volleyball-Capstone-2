import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getUserInfo } from '../features/auth/authSlice';
import ListDividers from '../components/ListDividers'; // Import the ListDividers component
import CreateIcon from '@mui/icons-material/Create'; // Import the Create icon



const MessagingInbox = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState(null); // Store the recipient user ID here


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesResponse = await axios.get('http://localhost:8000/messages/');
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8000/user/');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    fetchMessages();
    fetchUsers();
    dispatch(getUserInfo());
  }, [dispatch]);
  
  const filteredMessages = messages.filter(message => message.recipient === userInfo.id);


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
  const handleReply = (recipient) => {
    // Logic to handle the reply action
    console.log(`Replying to ${recipient}`);
  
    // Create a message object
    // Create a message object
    const newMessage = {
      sender: userInfo.id, // Assuming userInfo contains the ID of the current user
      recipient: selectedUser, // The recipient is the user you're replying to
      content: messageText, // Use the message text stored in state
      sent_time: new Date().toISOString(), // Use the current time as the sent_time
      read: false, // Set read status to false by default
    };

  
    axios.post('http://localhost:8000/messages/', newMessage)
      .then((response) => {
        console.log('Message sent successfully:', response.data);
        // Optionally, you can update the UI or display a success message
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        // Optionally, you can display an error message to the user
      }, [userInfo.id]); // Fetch messages when userInfo.id changes
  
    // Reset message text
    setMessageText('');
  };
  

  const handleSendMessage = () => {
    // Ensure that there's a selected user to send the message to
    if (!selectedUser) {
      console.error('No user selected to send message to.');
      return;
    }
    // Create a message object
    const newMessage = {
      sender: userInfo.id, // Assuming userInfo contains the ID of the current user
      recipient: selectedUser, // The recipient is the user you're replying to
      content: messageText, // Use the message text stored in state
      sent_time: new Date().toISOString(), // Use the current time as the sent_time
      read: false, // Set read status to false by default
    };
    // Send the message to the backend
    axios.post('http://localhost:8000/messages/', newMessage)
      .then((response) => {
        console.log('Message sent successfully:', response.data);
        // Optionally, you can update the UI or display a success message
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        // Optionally, you can display an error message to the user
      }, [userInfo.id]); // Fetch messages when userInfo.id changes
  
    // Reset message text
    setMessageText('');
  };

  return (
    <div className="container messaging__container">
      <h1 className='main__title'>{selectedUser ? `Messaging ${users.find(user => user.id === selectedUser).username}` : `Inbox`}</h1>
      <div className="messages">
        {messages.length === 0 ? (
          <p>Inbox Empty</p>
        ) : (
          filteredMessages.map(message => (
            <div key={message.id} className="message-container" style={{ marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{message.sender_username}</p>
              <p style={{ color: '#747f8d', fontSize: '0.8rem', marginBottom: '5px' }}>At: {formatTimestamp(message.sent_time)}</p>
              <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>{message.content}</p>
            </div>
            <button className="btn" onClick={() => handleReply(message.sender)}>Reply</button>
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
          <button className="btn" onClick={handleCreateMessage} style={{ display: 'inline-block' }}>Compose</button>
        </div>
      )}
    </div>
  );
 };  
  // Convert ISO 8601 timestamp to a formatted date string
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };
    return date.toLocaleString('en-US', options);
  };



export default MessagingInbox;
