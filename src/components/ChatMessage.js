import React from "react";

const ChatMessage = (props) => {
  const { uid, text, photoURL } = props.message;
  const messageClass = uid === props.currentUser.uid ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  );
};

export default ChatMessage;
