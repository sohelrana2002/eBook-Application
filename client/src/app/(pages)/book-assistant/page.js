"use client";

import { createBookAssistant } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your Book Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: ({ message }) => createBookAssistant(message),
    onSuccess: (data) => {
      const assistantMessage = {
        role: "assistant",
        text: data.reply || "Sorry, I cannot respond.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      alert(error?.response?.data?.message || "Book assistant is not response");
    },
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      mutation.mutate({
        message: input,
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Error connecting to server." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-md mx-auto border border-[var(--border)] rounded-2xl shadow-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-[var(--blue)] text-white px-4 py-3 font-semibold text-lg">
        Book Assistant
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] break-words
                ${
                  msg.role === "user"
                    ? "bg-[var(--blue)] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border)] flex items-center gap-2 bg-white">
        <textarea
          className="flex-1 resize-none border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none "
          rows={1}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-[var(--blue)] text-white px-4 py-2 rounded-lg "
        >
          Send
        </button>
      </div>
    </div>
  );
}
