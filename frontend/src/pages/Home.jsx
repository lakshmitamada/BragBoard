import Navbar from "../components/Navbar";
import "../styles/Home.scss";
import { useEffect, useState, useRef } from "react";
import { api } from "../api";

export default function Home() {
  const [active, setActive] = useState("createPost");
  // shout-out state
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [commentInput, setCommentInput] = useState({});
  // Tagging state
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  // Filtering state
  const [filters, setFilters] = useState({
    department: 'all',
    sender: '',
    dateRange: 'all'
  });
  const [filteredFeed, setFilteredFeed] = useState([]);

  const menuItems = [
    { key: "createPost", label: "Create Post" },
    { key: "shout", label: "Shout to Employee" },
    { key: "timeline", label: "Write on Timeline" },
    { key: "myAchievements", label: "My Achievements" },
    { key: "notifications", label: "Notifications" },
    { key: "teamBoard", label: "Team Board" },
    { key: "profile", label: "Profile Settings" },
  ];

  useEffect(() => {
    if (active === "shout") {
      fetchEmployees();
      fetchFeed();
    }
  }, [active]);

  // Apply filters when feed or filters change
  useEffect(() => {
    applyFilters();
  }, [feed, filters]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/users");
      setEmployees(res.data || []);
    } catch (_) {}
  };

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/auth/shoutouts/feed");
      setFeed(data || []);
    } catch (_) {}
  };

  const toggleTag = (userId) => {
    setSelectedTags((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const removeTag = (userId) => {
    setSelectedTags((prev) => prev.filter((id) => id !== userId));
  };

  const getSelectedUsers = () => {
    return employees.filter(emp => selectedTags.includes(emp.id));
  };

  const getFilteredUsers = () => {
    if (!tagSearchTerm) return employees;
    return employees.filter(emp => 
      emp.name?.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
      emp.username?.toLowerCase().includes(tagSearchTerm.toLowerCase())
    );
  };

  // Filtering functions
  const applyFilters = () => {
    let filtered = [...feed];

    // Filter by department (case-insensitive comparison)
    if (filters.department !== 'all') {
      filtered = filtered.filter(post => 
        post.author_department?.toLowerCase() === filters.department.toLowerCase()
      );
    }

    // Filter by sender
    if (filters.sender) {
      filtered = filtered.filter(post => 
        post.author_name?.toLowerCase().includes(filters.sender.toLowerCase()) ||
        post.author_username?.toLowerCase().includes(filters.sender.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(post => {
        const postDate = new Date(post.created_at);
        return postDate >= filterDate;
      });
    }

    setFilteredFeed(filtered);
  };

  const resetFilters = () => {
    setFilters({
      department: 'all',
      sender: '',
      dateRange: 'all'
    });
  };

  const getDepartments = () => {
    // Get departments from employees
    const employeeDepartments = [...new Set(employees.map(emp => emp.department))];
    
    // Add standard departments if they don't exist
    const standardDepartments = ['Information Technology', 'Human Resources', 'Finance'];
    
    // Combine and filter out duplicates
    const allDepartments = [...new Set([...employeeDepartments, ...standardDepartments])];
    
    return allDepartments.filter(dept => dept && dept.trim() !== '');
  };

  const submitShoutOut = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append("message", message);
      if (selectedTags.length) form.append("tagged_user_ids", selectedTags.join(","));
      if (imageFile) form.append("image", imageFile);
      await api.post("/auth/shoutouts", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("");
      setSelectedTags([]);
      setImageFile(null);
      await fetchFeed();
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  const react = async (id, emoji) => {
    try {
      await api.post(`/auth/shoutouts/${id}/react`, { emoji });
      await fetchFeed();
    } catch (_) {}
  };

  const toggleComments = async (id) => {
    setCommentsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!commentsMap[id]) {
      try {
        const { data } = await api.get(`/auth/shoutouts/${id}/comments`);
        setCommentsMap((m) => ({ ...m, [id]: data }));
      } catch (_) {}
    }
  };

  const submitComment = async (id) => {
    const text = (commentInput[id] || "").trim();
    if (!text) return;
    try {
      const { data } = await api.post(`/auth/shoutouts/${id}/comments`, { content: text });
      setCommentsMap((m) => ({ ...m, [id]: [ ...(m[id]||[]), data ] }));
      setCommentInput((ci) => ({ ...ci, [id]: "" }));
      await fetchFeed();
    } catch (_) {}
  };
  return (
    <>
      <Navbar />
      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={active === item.key ? "active" : ""}
                onClick={() => setActive(item.key)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <main className="content">
          {active === "createPost" && <h2>Create a new post</h2>}
          {active === "shout" && (
            <div>
              <h2>Send a shout to an employee</h2>
              <form className="shoutout-form" onSubmit={submitShoutOut}>
                <textarea placeholder="Write your shout-out..." value={message} onChange={(e) => setMessage(e.target.value)} />
                
                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    <label>Tagged People:</label>
                    <div className="selected-tags-list">
                      {getSelectedUsers().map((user) => (
                        <span key={user.id} className="selected-tag">
                          @{user.name || user.username}
                          <button type="button" onClick={() => removeTag(user.id)} className="remove-tag">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <label className="file-input">
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    Upload Image
                  </label>
                  
                  {/* Tag People Button */}
                  <div className="tag-people-container" ref={dropdownRef}>
                    <button 
                      type="button" 
                      className="tag-people-btn"
                      onClick={() => setShowTagDropdown(!showTagDropdown)}
                    >
                      👥 Tag People
                    </button>
                    
                    {/* Dropdown for selecting people */}
                    {showTagDropdown && (
                      <div className="tag-dropdown">
                        <div className="tag-search">
                          <input
                            type="text"
                            placeholder="Search people..."
                            value={tagSearchTerm}
                            onChange={(e) => setTagSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="tag-list">
                          {getFilteredUsers().map((user) => (
                            <div 
                              key={user.id} 
                              className={`tag-option ${selectedTags.includes(user.id) ? 'selected' : ''}`}
                              onClick={() => toggleTag(user.id)}
                            >
                              <div className="user-info">
                                <div className="user-avatar">{user.name?.[0] || user.username?.[0] || 'U'}</div>
                                <div className="user-details">
                                  <div className="user-name">{user.name || user.username}</div>
                                  <div className="user-department">{user.department}</div>
                                </div>
                              </div>
                              {selectedTags.includes(user.id) && <span className="checkmark">✓</span>}
                            </div>
                          ))}
                          {getFilteredUsers().length === 0 && (
                            <div className="no-users">No users found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Shout-out"}</button>
              </form>

              {/* Filters Section */}
              <div className="filters-section">
                <h3>🔍 Filter Shout-outs</h3>
                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Department:</label>
                    <select 
                      value={filters.department} 
                      onChange={(e) => setFilters({...filters, department: e.target.value})}
                    >
                      <option value="all">All Departments</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      {getDepartments().filter(dept => 
                        !['Information Technology', 'Human Resources', 'Finance'].includes(dept)
                      ).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Sender:</label>
                    <input
                      type="text"
                      placeholder="Search by sender name..."
                      value={filters.sender}
                      onChange={(e) => setFilters({...filters, sender: e.target.value})}
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label>Date Range:</label>
                    <select 
                      value={filters.dateRange} 
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  
                  <div className="filter-actions">
                    <button type="button" className="reset-filters-btn" onClick={resetFilters}>
                      🔄 Reset Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed Section */}
              <div className="feed-section">
                <div className="feed-header">
                  <h3>📢 Shout-out Feed ({filteredFeed.length} posts)</h3>
                  <div className="feed-stats">
                    <span className="stat-item">📊 Total: {feed.length}</span>
                    <span className="stat-item">🔍 Filtered: {filteredFeed.length}</span>
                  </div>
                </div>
                
                <div className="feed">
                  {filteredFeed.length === 0 ? (
                    <div className="no-posts">
                      <div className="no-posts-icon">📭</div>
                      <h4>No shout-outs found</h4>
                      <p>Try adjusting your filters or create the first shout-out!</p>
                    </div>
                  ) : (
                    filteredFeed.map((s) => (
                      <div key={s.id} className="card shout">
                        <div className="post-header">
                          <div className="author-info">
                            <div className="author-avatar">
                              {s.author_name?.[0] || s.author_username?.[0] || 'U'}
                            </div>
                            <div className="author-details">
                              <div className="author-name">{s.author_name || s.author_username || 'Unknown'}</div>
                              <div className="author-meta">
                                <span className="department">{s.author_department || 'Unknown Dept'}</span>
                                <span className="time">{new Date(s.created_at).toLocaleDateString()} at {new Date(s.created_at).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="post-actions">
                            <button className="action-btn">⋯</button>
                          </div>
                        </div>
                        
                        <div className="post-content">
                          <div className="message">{s.message}</div>
                          {s.image_url && (
                            <div className="image-container">
                              <img src={`http://127.0.0.1:8000${s.image_url}`} alt="shout" className="image" />
                            </div>
                          )}
                          {s.tagged_user_names?.length ? (
                            <div className="tags-line">
                              <span className="tagged-label">🏷️ Tagged:</span>
                              {s.tagged_user_names.map((n, idx) => (
                                <span key={idx} className="tag-ref">@{n}</span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        
                        <div className="post-interactions">
                          <div className="reactions">
                            {Object.entries(s.reactions || {}).map(([emoji, count]) => (
                              <span key={emoji} className="reaction-item">
                                <span className="emoji">{emoji}</span>
                                <span className="count">{count}</span>
                              </span>
                            ))}
                            <div className="reaction-buttons">
                              {['👍','🎉','🙏','❤️','🔥'].map((emo) => (
                                <button key={emo} type="button" className="reaction-btn" onClick={() => react(s.id, emo)}>
                                  {emo}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="comments">
                            <button type="button" className="toggle-comments" onClick={() => toggleComments(s.id)}>
                              💬 Comments ({s.comments_count || 0})
                            </button>
                            {commentsOpen[s.id] ? (
                              <div className="comments-body">
                                <ul className="comment-list">
                                  {(commentsMap[s.id] || []).map((c) => (
                                    <li key={c.id} className="comment-item">
                                      <div className="comment-avatar">{c.user_name?.[0] || 'U'}</div>
                                      <div className="comment-content">
                                        <div className="comment-meta">
                                          <span className="comment-author">{c.user_name || 'Unknown'}</span>
                                          <span className="comment-time">{c.created_at?.replace('T',' ').slice(0,16)}</span>
                                        </div>
                                        <div className="comment-text">{c.content}</div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <div className="comment-form">
                                  <input 
                                    value={commentInput[s.id] || ""} 
                                    onChange={(e) => setCommentInput((ci) => ({ ...ci, [s.id]: e.target.value }))} 
                                    placeholder="Write a comment..." 
                                  />
                                  <button type="button" onClick={() => submitComment(s.id)}>Post</button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          {active === "timeline" && <h2>Write on your timeline</h2>}
          {active === "myAchievements" && <h2>My Achievements</h2>}
          {active === "notifications" && <h2>Notifications</h2>}
          {active === "teamBoard" && <h2>Team Board</h2>}
          {active === "profile" && <h2>Profile Settings</h2>}
        </main>
      </div>
    </>
  );
}
