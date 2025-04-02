"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";

const socket = io("http://localhost:5000");

export default function Home() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "customer");
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const startSession = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/start-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      setSessionId(data.sessionId);
      socket.emit("join", { sessionId: data.sessionId, role });
  
      await getMessages(data.sessionId); // Fetch previous messages after starting the session
    } catch (err) {
      console.error("Error starting session:", err);
    }
  };
  

  const saveMessages = async (message) => {
    try {
      const response = await fetch("http://localhost:5000/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, sender: role, message }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  };
  

  const getMessages = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages?sessionId=${sessionId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Save the previous messages
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };
  

  useEffect(() => {
    startSession();

    socket.on("receive", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", ({ msg, role: senderRole }) => {
      if (role === "customer" && senderRole === "support_agent") {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000); // Hide after 2 seconds
      }
    });

    return () => {
      socket.off("receive");
      socket.off("typing");
    };
  }, [role]);

  const sendMessage = async() => {
    if (!input.trim()) return;
    const messageData = { sessionId, sender: role, message: input };
    socket.emit("message", messageData);
    await saveMessages(input);
    // setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  const handleTyping = () => {
    if (role === "support_agent") {
      console.log("sending typing event")
      socket.emit("typing", { sessionId, role });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold">Chat ({role})</h2>
      <select
        className="mb-2 p-2 border rounded"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="customer">Customer</option>
        <option value="support_agent">Support Agent</option>
      </select>
      <div className="border p-3 h-64 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === role ? "text-right" : "text-left"}
          >
            <strong>{msg.sender === role ? "You" : msg.sender}:</strong> {msg.message}
          </div>
        ))}
        {isTyping && <div className="text-gray-500">Agent is typing...</div>}
      </div>
      <input
        type="text"
        className="p-2 border w-full rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleTyping}
        placeholder="Type a message..."
      />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded w-full"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
}
