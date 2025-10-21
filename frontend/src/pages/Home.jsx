import Navbar from "../components/Navbar";
import "../styles/Home.scss";
<<<<<<< HEAD
import { useEffect, useState } from "react";
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
=======
import { useState } from "react";

export default function Home() {
  const [active, setActive] = useState("createPost");
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f

  const menuItems = [
    { key: "createPost", label: "Create Post" },
    { key: "shout", label: "Shout to Employee" },
    { key: "timeline", label: "Write on Timeline" },
    { key: "myAchievements", label: "My Achievements" },
    { key: "notifications", label: "Notifications" },
    { key: "teamBoard", label: "Team Board" },
    { key: "profile", label: "Profile Settings" },
  ];

<<<<<<< HEAD
  useEffect(() => {
    if (active === "shout") {
      fetchEmployees();
      fetchFeed();
    }
  }, [active]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/auth/department-employees");
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

=======
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
  return (
    <>
      <Navbar />
      <div className="home-container">
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
<<<<<<< HEAD
          {active === "shout" && (
            <div>
              <h2>Send a shout to an employee</h2>
              <form className="shoutout-form" onSubmit={submitShoutOut}>
                <textarea placeholder="Write your shout-out..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <div className="form-row">
                  <label className="file-input">
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <div className="tags">
                    {employees.map((e) => (
                      <button type="button" key={e.id} className={selectedTags.includes(e.id) ? "tag active" : "tag"} onClick={() => toggleTag(e.id)}>
                        @{e.name || e.id}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={loading}>{loading ? "Posting..." : "Post Shout-out"}</button>
              </form>

              <div className="feed">
                {feed.map((s) => (
                  <div key={s.id} className="card shout">
                    <div className="meta">
                      <div className="author">Post</div>
                      <div className="time">{s.created_at?.replace('T',' ').slice(0,16)}</div>
                    </div>
                    <div className="message">{s.message}</div>
                    {s.image_url && <img src={`http://127.0.0.1:8000${s.image_url}`} alt="shout" className="image" />}
                    {s.tagged_user_names?.length ? (
                      <div className="tags-line">
                        Tagged: {s.tagged_user_names.map((n, idx) => (<span key={idx} className="tag-ref">@{n}</span>))}
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
                            <input value={commentInput[s.id] || ""} onChange={(e) => setCommentInput((ci) => ({ ...ci, [s.id]: e.target.value }))} placeholder="Write a comment..." />
                            <button type="button" onClick={() => submitComment(s.id)}>Post</button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
=======
          {active === "shout" && <h2>Send a shout to an employee</h2>}
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
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
