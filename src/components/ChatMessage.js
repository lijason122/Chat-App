import React from "react";

const ChatMessage = (props) => {
  const { currentUser } = props;
  const { uid, text, name } = props.message;
  const messageClass = uid === currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        {uid !== currentUser.uid && <p className="">{name} :</p>}
        <p className="text">{text}</p>
      </div>
    </>
  );
};

export default ChatMessage;
