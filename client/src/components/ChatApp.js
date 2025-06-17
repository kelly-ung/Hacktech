import { useState, useRef, useEffect } from "react"
import "./ChatApp.css"
import ReactMarkdown from "react-markdown"

function ChatApp() {
  const [userMessage, setUserMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return // Do not send empty messages

    // Add user's message to chat
    const newMessages = [...messages, { sender: "You", text: userMessage }]
    setMessages(newMessages)
    setUserMessage("") 
    setLoading(true) 

    try {
      const response = await fetch("https://budgetnator-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.response) {
        setMessages([...newMessages, { sender: "Budgetnator", text: data.response }])
      } else {
        setMessages([...newMessages, { sender: "Budgetnator", text: "Error: Could not get response from AI." }])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages([
        ...newMessages,
        { sender: "Budgetnator", text: `Error: ${error.message || "Could not reach server."}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="app">
      <h1>Chat with Gemini AI</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.length === 0 && <div className="empty-state">What kind of investment can I help you with?</div>}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "You" ? "user" : "ai"}`}>
                <strong>{msg.sender}:</strong>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {loading && <div className="loading">✨Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <textarea className="input-texts"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={2}
            disabled={loading}
          />
          <button className="send-button" onClick={handleSendMessage} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatApp
