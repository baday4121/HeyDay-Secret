import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import StoryExport from '../components/StoryExport';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'inbox';

  const storyExportRef = useRef(null);

  const [data, setData] = useState({
    messages: null,
    archivedReplies: null,
    stats: { totalArchived: 0, archivedMessagesCount: 0, archivedRepliesCount: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const token = localStorage.getItem('adminToken');
  const authHeaders = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  };

  const fetchDashboard = async (url = `http://localhost:8000/api/dashboard?tab=${currentTab}`) => {
    if (!token) {
      navigate('/login-baday');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(url, authHeaders);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/login-baday');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [currentTab]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/message/${id}/read`, {}, authHeaders);
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/message/${id}/archive`, {}, authHeaders);
      setAlert(res.data.message);
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleReplyArchive = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/reply/${id}/archive`, {}, authHeaders);
      setAlert(res.data.message);
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message and all its replies?')) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/message/${id}`, authHeaders);
      setAlert(res.data.message);
      fetchDashboard();
    } catch (error) {
      console.error(error);
    }
  };

  const generateStory = (content, platform, e) => {
    if (storyExportRef.current) {
      storyExportRef.current.generateStory(content, platform, e.currentTarget);
    }
  };

  if (loading && !data.messages && !data.archivedReplies) {
    return <div className="flex items-center justify-center text-blue-500 font-bold py-20">Loading Dashboard...</div>;
  }

  const { stats, messages, archivedReplies } = data;
  const isReplyTab = currentTab === 'archived-replies';
  const activeData = isReplyTab ? archivedReplies : messages;

  return (
    <div className="w-full max-w-3xl">
      
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-xl font-bold text-gray-800">Anonymous Messages Inbox</h1>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold">
            Total Chats: <span className="font-bold">{activeData?.total || 0}</span>
          </span>
          <span className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg font-semibold">
            Total Replies: <span className="font-bold">{stats.archivedRepliesCount || 0}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setSearchParams({ tab: 'inbox' })} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${currentTab === 'inbox' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            Inbox
          </button>
          
          <button 
            onClick={() => setSearchParams({ tab: 'archived-messages' })} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${currentTab === 'archived-messages' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <span>Archived Messages</span>
            {stats.archivedMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                {stats.archivedMessagesCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setSearchParams({ tab: 'archived-replies' })} 
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${currentTab === 'archived-replies' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <span>Archived Replies</span>
            {stats.archivedRepliesCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                {stats.archivedRepliesCount}
              </span>
            )}
          </button>
        </div>

        <div className="text-xs text-gray-500 font-medium bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
          Total Archive: <span className="font-bold text-gray-800">{stats.archivedMessagesCount} Messages</span> | <span className="font-bold text-gray-800">{stats.archivedRepliesCount} Replies</span>
        </div>
      </div>

      {alert && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center font-semibold text-sm">
          {alert}
        </div>
      )}

      {isReplyTab ? (
        (!archivedReplies || archivedReplies.data.length === 0) ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
            No archived replies found.
          </div>
        ) : (
          <div className="space-y-4">
            {archivedReplies.data.map(reply => (
              <div key={reply.id} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded">ARCHIVED REPLY</span>
                    <p className="text-gray-400 text-xs font-medium">{timeAgo(reply.created_at)}</p>
                  </div>
                </div>
                
                <div className="pl-1">
                  <p className="text-gray-800 text-sm break-words whitespace-pre-line leading-relaxed font-semibold">{reply.content}</p>
                </div>

                {reply.message && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600">
                    <span className="font-bold text-gray-700">Key Message:</span> 
                    <p className="italic text-gray-500 mt-0.5">"{reply.message.content.length > 100 ? reply.message.content.substring(0, 100) + '...' : reply.message.content}"</p>
                  </div>
                )}
                
                <div className="mt-2 pt-3 border-t border-gray-100 flex justify-end items-center gap-3">
                  <button onClick={() => handleToggleReplyArchive(reply.id)} className="text-yellow-600 hover:text-yellow-800 text-[11px] font-medium transition">
                    Unarchive
                  </button>
                  {reply.message && (
                    <Link to={`/admin/message/${reply.message.id}`} className="text-blue-500 hover:text-blue-700 hover:underline text-[11px] font-medium transition whitespace-nowrap">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        (!messages || messages.data.length === 0) ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 text-sm">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.data.map(msg => {
              
              const hasUnreadReply = msg.has_unread_replies;

              return (
                <div key={msg.id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 ${msg.is_read ? 'border-gray-300 opacity-80' : 'border-blue-500'} flex flex-col gap-3`}>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse tracking-wider">NEW</span>
                      )}

                      {hasUnreadReply && (
                        <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce tracking-wider">NEW REPLY</span>
                      )}

                      {msg.replies_count > 0 && (
                        <div className="text-gray-400 text-xs font-medium flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{msg.replies_count} Replies</span>
                        </div>
                      )}

                      <p className="text-gray-400 text-xs font-medium">{timeAgo(msg.created_at)}</p>
                    </div>
                    
                    {!msg.is_read && (
                      <button onClick={() => handleMarkAsRead(msg.id)} className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition shadow-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Mark as Read
                      </button>
                    )}
                  </div>
                  
                  <div className="pl-1">
                    <p className={`text-gray-800 text-sm break-words whitespace-pre-line leading-relaxed ${msg.is_read ? 'font-normal' : 'font-semibold'}`}>
                      {msg.content.length > 610 ? msg.content.substring(0, 610) + '...' : msg.content}
                    </p>
                  </div>
                  
                  <div className="mt-2 pt-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    <div className="relative group">
                      <button type="button" className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 border border-gray-200 px-2.5 py-1.5 rounded transition">
                        <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Sender Info
                      </button>
                      
                      <div className="absolute left-0 bottom-full mb-2 w-max max-w-[280px] sm:max-w-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                        <div className="bg-gray-800 text-gray-300 text-[11px] rounded-lg p-3 shadow-xl border border-gray-700 font-mono leading-relaxed">
                          <div className="grid grid-cols-[45px_1fr] gap-x-2 gap-y-1.5">
                            <span className="text-gray-400 font-bold">IP:</span> 
                            <span className="break-words text-white">{msg.ip_address || 'N/A'}</span>
                            
                            <span className="text-gray-400 font-bold">Loc:</span> 
                            <span className="break-words text-white">{msg.location || 'N/A'}</span>
                            
                            <span className="text-gray-400 font-bold">Dev:</span> 
                            <span className="break-words text-white">{msg.user_agent || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-gray-800 border-b border-r border-gray-700 transform rotate-45 absolute -bottom-1.5 left-6"></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Share to:</span>
                        <div className="flex gap-1.5">
                          <button onClick={(e) => generateStory(msg.content, 'IG', e)} title="Share to Instagram" className="flex justify-center items-center w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 transition shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                          </button>
                          <button onClick={(e) => generateStory(msg.content, 'WA', e)} title="Share to WhatsApp" className="flex justify-center items-center w-7 h-7 rounded-full bg-[#25D366] text-white hover:scale-110 transition shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-3.5 h-3.5"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>
                      
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleToggleArchive(msg.id)} className="text-yellow-600 hover:text-yellow-800 text-[11px] font-medium transition">
                          {msg.is_archived ? 'Unarchive' : 'Archive'}
                        </button>

                        <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-700 text-[11px] font-medium transition">
                          Delete
                        </button>

                        <Link to={`/admin/message/${msg.id}`} className="text-blue-500 hover:text-blue-700 hover:underline text-[11px] font-medium transition whitespace-nowrap">
                          View Details
                        </Link>
                      </div>
                      
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )
      )}

      {activeData && activeData.last_page > 1 && (
        <div className="mt-6 flex justify-between gap-4">
          <button
            disabled={!activeData.prev_page_url}
            onClick={() => fetchDashboard(activeData.prev_page_url)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &laquo; Previous
          </button>
          <button
            disabled={!activeData.next_page_url}
            onClick={() => fetchDashboard(activeData.next_page_url)}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg shadow-sm text-xs font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next &raquo;
          </button>
        </div>
      )}

      <StoryExport ref={storyExportRef} />

    </div>
  );
}