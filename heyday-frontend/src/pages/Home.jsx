import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchMessages = async (url = 'http://localhost:8000/api/messages') => {
    try {
      const res = await axios.get(url);
      if (res.data.success) {
        setMessages(res.data.data.data);
        setPagination(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) {
      setErrorMsg("The content field is required.");
      return;
    }

    setSending(true);
    setAlert(null);
    setErrorMsg(null);

    try {
      const res = await axios.post('http://localhost:8000/api/send', { content });
      
      if (res.data.success) {
        if (res.data.warning === 'profanity_detected') {
          window.alert("⚠️ System Warning:\n\n" + res.data.message);
          setAlert({ type: 'warning', text: 'Message sent but archived due to system rules.' });
        } else {
          setAlert({ type: 'success', text: res.data.message });
        }
        
        setContent('');
        fetchMessages();
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to send message. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-lg px-4 sm:px-0">
        
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-800">
            Send Anonymous Message to Baday
          </h2>
          <p className="text-center text-gray-500 mb-6 text-xs sm:text-sm">
            Say whatever is on your mind.<br />
            Your identity will remain completely anonymous. 🤫
          </p>

          {alert && (
            <div className={`p-3 rounded mb-4 text-center font-semibold text-xs sm:text-sm ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
              {alert.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows="4"
                className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs sm:text-sm resize-none"
                placeholder="Write something here..."
                required
              />
              {errorMsg && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errorMsg}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={sending}
              className={`w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {sending ? <span>Sending...</span> : <span>Send Message</span>}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-4 text-xs sm:text-sm">
              No messages yet. Be the first!
            </p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="bg-white p-5 rounded-xl shadow-sm overflow-hidden">
                {msg.replies_count > 0 && (
                  <div className="flex justify-end mb-2">
                    <div className="text-gray-400 text-[10px] font-semibold inline-flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{msg.replies_count} Replies</span>
                    </div>
                  </div>
                )}

                <p className="text-gray-700 text-xs sm:text-sm font-normal mb-3 break-words whitespace-pre-wrap">
                  {msg.content.length > 510 ? msg.content.substring(0, 510) + '...' : msg.content}
                </p>

                <div className="mt-4 flex justify-between items-center text-xs">
                  <span className="text-gray-400">{timeAgo(msg.created_at)}</span>
                  <Link to={`/message/${msg.id}`} className="text-blue-500 hover:underline font-semibold">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="mt-6 flex justify-between gap-4">
            <button
              disabled={!pagination.prev_page_url}
              onClick={() => fetchMessages(pagination.prev_page_url)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &laquo; Previous
            </button>
            <button
              disabled={!pagination.next_page_url}
              onClick={() => fetchMessages(pagination.next_page_url)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &raquo;
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}