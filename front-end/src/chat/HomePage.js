import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserCard from './UserCard';
import './HomePage.css';
import ChatInterface from './ChatInterface';

const HomePage = () => {
  const { id } = useParams();
  const [messagedUsers, setMessagedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState();
  const [session, setSession] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.20:8000/session/username/${id}-user2/`);
        console.log(response.data.data)
        setMessagedUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleNewChatClick = async () => {
    try {
      const response = await axios.get('http://192.168.1.20:8000/user/', {
        params: {
          username: id,
        },
      });
      setAvailableUsers(response.data.data);
      setShowPopup(true);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const setChoosenPerson = (e) => {
    console.log(e.username)
    get_session(e.username)
    setReceiver(e.username)
  }

  const get_session = (username) => {
    let user1, user2
    if (username < id) {
      user1 = username
      user2 = id
    } else {
      user1 = id
      user2 = username
    }
    try {
      const data = axios.post(`http://192.168.1.20:8000/session/username/${id}-${username}/`)
      data.then(response =>{
        const responseData = response.data.data
        setSession(responseData)
      }).catch(error=>{
        console.error(error)
      })
      // console.log(response, response.data, Promise)
      
    } catch (err){
      console.log(err)
    }
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  };


  return (
    <div className="container">
      <div>
        <div className="left-side-panel">
        <h1>Welcome, {id}!</h1>
        <div className="user-list">
          <div className="button-container">
            <button className="button" onClick={handleNewChatClick} style={{ display: showPopup ? 'none' : 'block' }}> New Chat </button>
            <button className="button" onClick={handleClosePopup} style={{ display: showPopup ? 'block' : 'none' }}> Hide Chat </button>
          </div>
          <div>
            {messagedUsers.map((user) => (
              <UserCard key={user.username} user={user} onClick={setChoosenPerson}/>
            ))}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>List of available users:</p>
            <div>
              {availableUsers.map((user) => (
                <UserCard key={user.username} user={user} onClick={setChoosenPerson}/>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="chat-area">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      </div>
      <div>
          <ChatInterface session={session} />
      </div>
    </div>
  );
};

export default HomePage;
