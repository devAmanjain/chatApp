"use client"
import React, { useState } from "react";
import { io } from "socket.io-client";
import Messages from "@/components/Messages";

const Home: React.FC = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");

  const socket:any = io('http://localhost:3004') ;

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      if (socket) {
        console.log("object");
        socket.emit("join room", roomId);
        setShowSpinner(true);
        setTimeout(() => {
          setShowChat(true);
          setShowSpinner(false);
        }, 4000);
      }
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <input
          className="border border-gray-300 rounded-md p-2 m-2"
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className="border border-gray-300 rounded-md p-2 m-2"
          type="text"
          placeholder="Room ID"
          onChange={(e) => setRoomId(e.target.value)}
          disabled={showSpinner}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleJoin()}
          disabled={showSpinner}
        >
          {!showSpinner ? "Join" : "Joining..."}
        </button>
      </div>
      {showChat && (
        <div className="mt-4">
          {socket && <Messages socket={socket} roomId={roomId} username={userName} />}
        </div>
      )}
    </div>
  );
};

export default Home;