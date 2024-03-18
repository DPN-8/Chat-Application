import React, { useEffect, useState } from "react";
import "./ChatInterface.css";

const ChatInterface = ({ session }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const [user1, setUser1] = useState();
  const [user2, setUser2] = useState();

  useEffect(() => {
    setUser1(session.receiver < session.sender ? session.receiver : session.sender);
    setUser2(session.receiver > session.sender ? session.receiver : session.sender);
  }, [session.receiver, session.sender]);

  useEffect(() => {
    if (user1 && user2 && session.session_key) {
      const socket = new WebSocket(
        `ws://192.168.1.20:8000/ws/chat/public_room/${user1}-${user2}/?session_key=${encodeURIComponent(session.session_key)}`
      );
      socket.onopen = function (e) {
        console.log("Chat socket successfully connected.");
      };

      socket.onclose = function (e) {
        console.log("Chat socket closed unexpectedly");
      };

      socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log(data);
        if (Array.isArray(data)) {
          data.forEach((msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
          });
        } else {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };

      setChatSocket(socket);
    }
  }, [user1, user2]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    
    if (message.trim() !== "" && chatSocket) {
      const newMessage = {
        sender: session.sender,
        receiver: session.receiver,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        session_key: session.session_key,
      };
      chatSocket.send(JSON.stringify(newMessage));
      setMessage("");
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
                  msg.sender === session.sender ? "sent" : "received"
                }`}
              >
                <span
                  className={`${msg.sender === session.sender ? "text-right" : "text-left"}`}
                >
                  {msg.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
