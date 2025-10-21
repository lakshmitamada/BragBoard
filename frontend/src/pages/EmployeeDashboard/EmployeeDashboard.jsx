<<<<<<< HEAD
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../EmployeeDashboard/EmployeeDashboard.scss";
import "../../styles/Navbar.scss";
import { api } from "../../api";

export default function EmployeeDashboard() {
  const [feed, setFeed] = useState([]);
  const [commentsOpen, setCommentsOpen] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [newComment, setNewComment] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
    fetchMetrics();
  }, []);

  const fetchFeed = async () => {
    try {
      const res = await api.get("/auth/shoutouts/feed");
      setFeed(res.data || []);
    } catch (err) {
      console.error("Failed to load feed", err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data } = await api.get("/auth/metrics/me");
      setMetrics(data);
    } catch (_) {}
  };


  const react = async (id, emoji) => {
    try {
      await api.post(`/auth/shoutouts/${id}/react`, { emoji });
      await fetchFeed();
      await fetchMetrics();
    } catch (err) {
      console.error("Failed to react", err);
    }
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
    if (!newComment.trim()) return;
    try {
      const { data } = await api.post(`/auth/shoutouts/${id}/comments`, { content: newComment });
      setCommentsMap((m) => ({ ...m, [id]: [ ...(m[id]||[]), data ] }));
      setNewComment("");
      await fetchFeed();
      await fetchMetrics();
    } catch (e) {
      // ignore
    }
  };

=======
import Navbar from "../../components/Navbar";
import "../EmployeeDashboard/EmployeeDashboard.scss";
import "../../styles/Navbar.scss"

export default function EmployeeDashboard() {
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
<<<<<<< HEAD
        <h1>Shout-outs</h1>

        {/* Performance Summary */}
        {metrics && (
          <div className="cards" style={{marginTop: "16px"}}>
            <div className="card"><h2>Shoutouts Given</h2><p>{metrics.shoutouts_given}</p></div>
            <div className="card"><h2>Shoutouts Received</h2><p>{metrics.shoutouts_received}</p></div>
            <div className="card"><h2>Comments Made</h2><p>{metrics.comments_made}</p></div>
          </div>
        )}

        {/* Recent activity removed as requested */}

        <div className="feed">
          {feed.map((s) => (
            <div key={s.id} className="card shout">
              <div className="message">{s.message}</div>
              <div className="timestamp">{(s.created_at || "").slice(0,10)}</div>
              {s.image_url && (
                <img src={`http://127.0.0.1:8000${s.image_url}`} alt="shout" className="image" />
              )}
              {s.tagged_users?.length ? (
                <div className="tags-line">
                  Tagged: {s.tagged_user_names?.length ? s.tagged_user_names.map((n, idx) => (
                    <span key={idx} className="tag-ref">@{n}</span>
                  )) : s.tagged_users.map((id) => (
                    <span key={id} className="tag-ref">@{id}</span>
                  ))}
                </div>
              ) : null}
              <div className="reactions">
                {Object.entries(s.reactions || {}).map(([emoji, count]) => (
                  <span key={emoji} className="reaction-item">{emoji} {count}</span>
                ))}
                <div className="reaction-buttons">
                  {['👍','🎉','🙏','❤️','🔥'].map((emo) => (
                    <button key={emo} type="button" onClick={() => react(s.id, emo)}>{emo}</button>
                  ))}
                </div>
              </div>
              <div className="comments">
                <button type="button" className="toggle-comments" onClick={() => toggleComments(s.id)}>
                  Comments ({s.comments_count || 0})
                </button>
                {commentsOpen[s.id] ? (
                  <div className="comments-body">
                    <ul className="comment-list">
                      {(commentsMap[s.id] || []).map((c) => (
                        <li key={c.id}>
                          <span className="c-meta">{c.created_at?.replace('T',' ').slice(0,16)}</span>
                          <span className="c-text">{c.content}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="comment-form">
                      <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." />
                      <button type="button" onClick={() => submitComment(s.id)}>Post</button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
=======
        <h1>Employee Dashboard</h1> 
        <p>Welcome! </p>
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
      </div>
    </>
  );
}
