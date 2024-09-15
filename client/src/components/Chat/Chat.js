import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import Rstb from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

const ENDPOINT = "https://chat-app--alpha.vercel.app";

let socket;

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setmessages] = useState([]);

  const send = () => {
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default Enter key action (e.g., form submission)
        send();
    }
};

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      setid(socket.id);
    });
    socket.emit("joined", { user: user }); //emit means sending data to backend

    socket.on("welcome", (data) => {
      //socket.on means recieve
      setmessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("userJoined", (data) => {
      setmessages([...messages, data]);
      console.log(data.user, data.message);
    });
    socket.on("leave", (data) => {
      setmessages([...messages, data]);
      console.log(data.user, data.message);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setmessages([...messages, data]);
      console.log(data.user, data.message, data.id);
    });
    return () => {
      socket.off();
    };
  }, [messages]);

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
        <h2>CHAT-APP</h2>
        <a href="/" ><img src={closeIcon} alt="Close" /></a>
        </div>
        <Rstb className="chatBox">
          {messages.map((item, i) => (
            <Message  
            key={i} 
            user={item.id === id ? '' : item.user} 
            classs={item.id === id ? 'right' : 'left'} 
            message={item.message} />
            
          ))}
        </Rstb>
        <div className="inputBox">
          <input onKeyDown={handleKeyDown}  type="text" id="chatInput" placeholder="Type a message..." />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
