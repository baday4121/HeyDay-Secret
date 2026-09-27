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

export default function AdminDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [alert, setAlert] = useState(null);

  const token = localStorage.getItem('adminToken');
  const authHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  };

  const fetchMessageDetail = async () => {
    if (!token) {
      navigate('/login-baday');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/api/admin/message/${id}`, authHeaders);
      if (res.data.success) {
        setMessage(res.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login-baday');
      } else {
        console.error("Failed to fetch message:", error);
      }
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
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/reply/${replyId}`, authHeaders);
      setAlert({ type: 'success', text: res.data.message });
      fetchMessageDetail(); // Refresh data
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleReplyArchive = async (replyId) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/reply/${replyId}/archive`, {}, authHeaders);
      setAlert({ type: 'success', text: res.data.message });
      fetchMessageDetail();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReplySubmit = async (e) => {
    if (e) e.preventDefault();
    if (!replyContent.trim()) return;

    setSending(true);
    setAlert(null);

    try {
      const res = await axios.post(`http://localhost:8000/api/message/${id}/reply`, { content: replyContent });
      if (res.data.success) {
        if (res.data.warning === 'profanity_detected') {
          window.alert("⚠️ System Warning:\n\n" + res.data.message);
        } else {
          setAlert({ type: 'success', text: res.data.message });
        }
        setReplyContent('');
        fetchMessageDetail();
      }
    } catch (error) {
      setAlert({ type: 'error', text: 'Failed to send reply.' });
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">Loading Detail...</div>;
  if (!message) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Message not found!</div>;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md px-2 sm:px-0">
        
        <Link to="/dashboard" className="px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 mb-4 inline-block text-xs font-semibold shadow-sm transition">
          Back to Dashboard
        </Link>

        {alert && alert.type === 'success' && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-semibold text-sm">
            {alert.text}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-6 relative overflow-hidden">
          <p className="text-xs text-gray-400 mb-2">Anonymous Message • {timeAgo(message.created_at)}</p>
          <p className="text-gray-700 text-sm mb-4 break-words whitespace-pre-line font-semibold">{message.content}</p>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 font-mono leading-relaxed">
            <div className="font-bold text-gray-800 mb-1">Tracking Info:</div>
            <div><span className="text-gray-400">Location :</span> {message.location || 'N/A'}</div>
            <div><span className="text-gray-400">IP Address :</span> {message.ip_address || 'N/A'}</div>
            <div><span className="text-gray-400">Device :</span> {message.user_agent || 'N/A'}</div>
          </div>

          <button onClick={handleDeleteMessage} className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 hover:bg-red-100 p-2 rounded transition">
            Delete Message
          </button>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-gray-700 text-sm ml-1">Replies ({message.replies?.length || 0})</h3>
          
          {message.replies && message.replies.length > 0 ? (
            message.replies.map((reply) => (
              <div key={reply.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                <p className="text-xs text-gray-400 mb-2 flex items-center">
                  Anonymous Reply • {timeAgo(reply.created_at)}
                  {reply.is_archived ? (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded">TOXIC</span>
                  ) : null}
                </p>
                <p className="text-gray-700 text-sm mb-4 break-words whitespace-pre-line">{reply.content}</p>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600 font-mono leading-relaxed">
                  <div className="font-bold text-gray-800 mb-1">Tracking Info:</div>
                  <div><span className="text-gray-400">Location :</span> {reply.location || 'N/A'}</div>
                  <div><span className="text-gray-400">IP Address :</span> {reply.ip_address || 'N/A'}</div>
                  <div><span className="text-gray-400">Device :</span> {reply.user_agent || 'N/A'}</div>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button onClick={() => handleToggleReplyArchive(reply.id)} className="text-yellow-600 hover:text-yellow-800 text-xs font-bold bg-yellow-50 hover:bg-yellow-100 p-2 rounded transition">
                    {reply.is_archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button onClick={() => handleDeleteReply(reply.id)} className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 hover:bg-red-100 p-2 rounded transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm py-4">No replies yet.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-10">
          <form onSubmit={handleReplySubmit}>
            <textarea 
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="2" 
              className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none" 
              placeholder="Write your reply here... (Press Enter to send)" 
              required
            />
            
            <button 
              type="submit" 
              disabled={sending}
              className={`mt-2 w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm shadow-sm flex items-center justify-center gap-2 ${sending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {sending ? <span>Sending...</span> : <span>Send Reply</span>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}