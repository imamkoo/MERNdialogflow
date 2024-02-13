import React, { useEffect, useState } from "react";
import "../index.css";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Muat riwayat pesan dari localStorage ketika komponen dimuat
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Simpan pesan ke localStorage setiap kali ada perubahan pada messages
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const fetchToken = () => {
    return localStorage.getItem("token");
  };

  const sendMessageToBackend = async (messageText) => {
    setIsLoading(true);
    const token = fetchToken();
    if (!token) {
      setError("You must be logged in to chat.");
      setIsLoading(false);
      return;
    }

    // Tambahkan pesan pengguna ke tampilan segera tanpa menunggu respons
    const tempId = new Date().getTime(); // ID sementara untuk tracking
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: tempId, text: messageText, sender: "user" },
    ]);

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
      // Tambahkan respons dari bot ke tampilan
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.id !== tempId), // Hapus pesan sementara
        { id: tempId, text: messageText, sender: "user" }, // Tambahkan ulang untuk memastikan urutan
        { id: new Date().getTime(), text: reply, sender: "bot" },
      ]);
    } catch (error) {
      setError(error.message);
      // Hapus pesan sementara jika gagal
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempId)
      );
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

  return (
    <div className="flex flex-col h-screen ">
      <div className="flex-grow overflow-y-auto p-4 space-y-2 chat-container ">
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
      </div>
      <div className="chat-input-container">
        <form
          onSubmit={handleSubmit}
          className="flex p-4 space-x-3 bg-gray-100 "
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
