import React, { useState, useRef } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { serverTimestamp } from "firebase/firestore";
import ChatMessage from "./ChatMessage";
import { useNavigate } from "react-router-dom";
import "./chat.css";

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const messagesRef = db.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = currentUser;

    await messagesRef.add({
      uid,
      photoURL,
      text: formValue,
      createdAt: serverTimestamp(),
    });

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
        <h1>Chat</h1>
        <button className="link" variant="link" onClick={handleLogout}>
          Sign out
        </button>
      </header>
      <section>
        <main>
          {messages &&
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                currentUser={currentUser}
              />
            ))}
          <div ref={scroll}></div>
        </main>
        <form className="chat" onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Chat;
