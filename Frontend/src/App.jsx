import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`);

function App() {
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (roomName && name && message) {
      // setMessages((prev) => [...prev, { roomName, name, message }]);
      socket.emit("sendMessage", { roomName, name, message });
      // setName("");
      setMessage("");
    } else {
      alert("Please fill all fields");
    }
  };

  const handleClick = () => {
    const userInput = prompt("Please enter room name:");

    if (userInput) {
      setRoomName(userInput);
      socket.emit("joinRoom", userInput);
    } else {
      handleClick();
    }
  };

  return (
    <div>
      {!roomName ? (
        <button onClick={handleClick}>Click to join a Room</button>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="Your Name"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            value={message}
            placeholder="Your message"
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      )}

      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.name}: {message.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
