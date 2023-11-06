import React from 'react';

const ChatBotReply = ({ messages }) => {
  return (
    <div className="bot-reply">
      {messages.map((message, index) => (
        <div
          id='chat'
          key={index}
          className={`message ${message.role} p-3 mb-2 rounded  ${
            message.role === 'user' ? 'bg-gray-100 text-black' : 'bg-gray-300 text-black rounded' // Updated class names
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};

export default ChatBotReply;
