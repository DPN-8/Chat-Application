import React, { useEffect, useState } from "react";
import "./ChatInterface.css";

const ChatInterface = ({session}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();
  let receiver = session.receiver
  let sender = session.sender  
  useEffect(() => {
    console.log(session);
    let receiver = session.receiver
    let sender = session.sender
    if (receiver && sender) {
      if (receiver < sender) {
        setUser1(receiver);
        setUser2(sender);
      } else {
        setUser1(sender);
        setUser2(receiver);
      }
    }
  }, [receiver,sender]);

  useEffect(() => {
    console.log(user1, " ", user2);
    if (user1 && user2) {
      //   const respose = axios.post('http://192.168.1.20:8000/')
      const socket = new WebSocket(
        `ws://192.168.1.20:8000/ws/chat/public_room/${user1}-${user2}/`
      );
      console.log(socket.url)
      socket.onopen = function (e) {
        console.log("Chat socket successfully connected.");
      };

      socket.onclose = function (e) {
        console.log("Chat socket closed unexpectedly");
      };

      socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      };

      setChatSocket(socket);

      return () => {
        socket.close();
      };
    }
  }, [user1, user2]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "" && chatSocket) {
      const newMessage = {
        sender: sender,
        receiver: receiver,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
      chatSocket.send(JSON.stringify(newMessage));
      setMessage("");
      //   setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Welcome to Room</h3>
      <div className="row">
        <div className="col-lg-4">
          <div className="w-100">
            <div className="mb-3">
              <label htmlFor="textMessage" className="form-label">
                Enter your message:
              </label>
              <input
                type="text"
                className="form-control"
                id="textMessage"
                value={message}
                onChange={handleMessageChange}
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="btn btn-primary rounded-1"
            >
              Send
            </button>
          </div>
        </div>
        <div className="col-lg-8">
          <div id="messages" className="mt-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === sender ? "sent" : "received"
                }`}
              >
                <span>{msg.sender}: </span>
                <span>{msg.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
