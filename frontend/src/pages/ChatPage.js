import React, { useEffect, useRef, useState } from "react";
import "../index.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const endOfMessagesRef = useRef(null);

  const fetchToken = () => localStorage.getItem("token");

  const sendMessageToBackend = async (messageText) => {
    setIsLoading(true);
    // Langkah 1: Tambahkan pesan pengguna ke state segera
    const newMessageObj = { text: messageText, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);

    const token = fetchToken();
    if (!token) {
      setError("You must be logged in to chat.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/chat/send-message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: messageText }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message.");
      }

      const { reply } = await response.json();
      // Langkah 2: Tambahkan balasan bot ke state setelah diterima
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: reply, sender: "bot" },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageToBackend(newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-y-auto p-4 space-y-2 pb-36">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-xs p-2 text-white rounded-md ${
              message.sender === "user"
                ? "ml-auto bg-blue-500"
                : "mr-auto bg-green-500"
            }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="p-2 bg-gray-100 border-t border-gray-200 w-full fixed inset-x-0 bottom-0 ">
        <form
          onSubmit={handleSubmit}
          className="flex p-2 space-x-3 bg-gray-100"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow p-2 border rounded-md"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </div>
  );
}

export default ChatPage;
