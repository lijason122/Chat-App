import React, { useState, useRef } from "react";
import { db, useCollectionData, serverTimestamp } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import ChatMessage from "./ChatMessage";
import { useNavigate } from "react-router-dom";
import "./chat.css";

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query);

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = currentUser;
    if (formValue.trim() !== "") {
      await messagesRef.add({
        uid,
        text: formValue,
        createdAt: serverTimestamp(),
        name: currentUser.displayName,
      });
    } else {
      alert("Please type a message");
    }

    setFormValue("");

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  const scroll = useRef();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.log("Failed to log out");
    }
  }

  return (
    <div className="Chat-App">
      <header>
        <h1>Team Chat</h1>
        <button className="link" variant="link" onClick={handleLogout}>
          Sign out
        </button>
      </header>
      <section>
        <main>
          {messages &&
            messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} currentUser={currentUser} />
            ))}
          <div ref={scroll}></div>
        </main>
        <form className="chat" onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
