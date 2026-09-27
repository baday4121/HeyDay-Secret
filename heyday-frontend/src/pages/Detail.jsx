import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const token = localStorage.getItem('adminToken');
  const authHeaders = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};

  const fetchMessageDetail = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/message/${id}`);
      if (res.data.success) {
        setMessage(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageDetail();
  }, [id]);

  const handleDeleteMessage = async () => {
    if (!window.confirm('Are you sure you want to delete this message and all its replies?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/message/${id}`, authHeaders);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to delete message.');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/reply/${replyId}`, authHeaders);
      setAlert({ type: 'success', text: 'Reply has been successfully deleted!' });
      fetchMessageDetail();
    } catch (error) {
      console.error(error);
      alert('Failed to delete reply.');
    }
  };

  const handleReplySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!replyContent.trim()) {
      setErrorMsg("The content field is required.");
      return;
    }

    setSending(true);
    setAlert(null);
    setErrorMsg(null);

    try {
      const res = await axios.post(`http://localhost:8000/api/message/${id}/reply`, { content: replyContent });
      
      if (res.data.success) {
        if (res.data.warning === 'profanity_detected') {
          window.alert("⚠️ System Warning:\n\n" + res.data.message);
          setAlert({ type: 'warning', text: 'Reply sent but archived due to system rules.' });
        } else {
          setAlert({ type: 'success', text: res.data.message });
        }
        setReplyContent('');
        fetchMessageDetail(); 
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Failed to send reply. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  if (loading) return <div className="text-gray-500 font-bold mt-10">Loading message...</div>;
  if (!message) return <div className="text-red-500 font-bold mt-10">Message not found!</div>;

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      
      <Link to="/" className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 mb-4 inline-block text-xs font-semibold shadow-sm transition">
        Back
      </Link>

      {alert && (
        <div className={`p-3 rounded mb-4 text-center font-semibold text-sm ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
          {alert.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 relative overflow-hidden">
        <p className="text-xs text-gray-400 mb-2">Anonymous Message • {timeAgo(message.created_at)}</p>
        <p className="text-gray-700 text-sm mb-3 break-words whitespace-pre-line">{message.content}</p>

        {token && (
          <button 
            onClick={handleDeleteMessage} 
            className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 p-2 rounded transition"
          >
            Delete Message
          </button>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-gray-700 text-sm ml-1">Replies ({message.replies ? message.replies.length : 0}):</h3>
        
        {message.replies && message.replies.length > 0 ? (
          message.replies.map((reply) => (
            <div key={reply.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
              <p className="text-xs text-gray-400 mb-2">Anonymous Reply • {timeAgo(reply.created_at)}</p>
              <p className="text-gray-700 text-sm mb-3 break-words whitespace-pre-line">{reply.content}</p>

              {token && (
                <button 
                  onClick={() => handleDeleteReply(reply.id)} 
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 p-2 rounded transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm">No replies yet.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-10">
        <form onSubmit={handleReplySubmit}>
          <textarea 
            name="content" 
            rows="2" 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" 
            placeholder="Write your reply here... (Press Enter to send)" 
            required
          />
          
          {errorMsg && (
            <p className="text-red-500 text-xs mt-1 font-semibold">{errorMsg}</p>
          )}
          
          <button 
            type="submit" 
            disabled={sending}
            className={`mt-2 w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm flex items-center justify-center gap-2 ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{sending ? 'Sending...' : 'Send Reply'}</span>
          </button>
        </form>
      </div>
      
    </div>
  );
}