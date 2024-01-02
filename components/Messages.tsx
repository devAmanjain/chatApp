'use client'
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
interface MessageTypes {
  roomId: string | number;
  user: string;
  message: string;
  time: string;
}

interface MessagesProps {
  socket: any;
  username: string;
  roomId: string | number;
}


const Messages: React.FC<MessagesProps> = ({ socket, username, roomId }) => {
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage !== '') {
      const msgData: MessageTypes = {
        roomId,
        user: username,
        message: newMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      console.log(msgData,"msg");
      await socket.emit('send message', msgData);
      setNewMessage('');
    }
  };

  
  useEffect(() => {
    socket.on("receive_msg", (data: MessageTypes) => {
        console.log("rec",data);

        setMessages((pre) => [...pre, data]);
    });
  }, [socket]);

  

  console.log("rr",messages);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.user === username ? 'text-right' : 'text-left'
            } p-2 border-b`}
          >
            <p className="text-gray-600">{msg.user}</p>
            <p className="text-gray-800">{msg.message}</p>
            <p className="text-gray-400 text-xs">{msg.time}</p>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => sendMessage(e)} className="flex p-2">
        <input
          className="flex-1 rounded-l-lg border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white px-2 py-2"
          type="text"
          value={newMessage}
          placeholder="Type your message.."
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="rounded-r-lg border-t border-b border-r text-white bg-blue-500 px-5 py-2" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Messages;