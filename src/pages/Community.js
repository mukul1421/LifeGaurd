import React, { useState, useEffect, useContext } from "react";
import { LangContext } from "../App";
import api from "../api";



export default function Community() {
  const { lang } = useContext(LangContext);

  /* ================= LANGUAGE TEXT ================= */
  const t = {
    en: {
      title: "Community Discussions",
      subtitle:
        "Share your thoughts, tips, health experiences and support each other 💚",
      placeholder: "Share something helpful...",
      postBtn: "Post",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      commentPlaceholder: "Add comment…",
      deletePostConfirm: "Delete this post?",
      deleteCommentConfirm: "Delete this comment?",
    },

    hi: {
      title: "समुदाय चर्चा",
      subtitle:
        "अपने विचार, सुझाव और स्वास्थ्य अनुभव साझा करें और एक-दूसरे की मदद करें 💚",
      placeholder: "कुछ उपयोगी साझा करें...",
      postBtn: "पोस्ट करें",
      edit: "संपादित करें",
      delete: "हटाएं",
      save: "सहेजें",
      cancel: "रद्द करें",
      commentPlaceholder: "टिप्पणी जोड़ें…",
      deletePostConfirm: "क्या आप इस पोस्ट को हटाना चाहते हैं?",
      deleteCommentConfirm: "क्या आप इस टिप्पणी को हटाना चाहते हैं?",
    },
  };

  /* ================= CURRENT USER ================= */
  const user = JSON.parse(localStorage.getItem("lg_user") || "{}");
  const userEmail = user?.email || "guest";

  const STORAGE_KEY = `lg_community_${userEmail}`;

  /* ================= STATE ================= */
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  const [newPost, setNewPost] = useState("");
  const [editPostText, setEditPostText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [newComment, setNewComment] = useState({});
  const [editComment, setEditComment] = useState({});
  const [editingCommentPostId, setEditingCommentPostId] = useState(null);
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  /* ================= FETCH POSTS FROM BACKEND ================= */
useEffect(() => {
  api.get("/community")
    .then((res) => {
      const formatted = res.data.map((p) => ({
        id: p._id,
        name: p.username,
        text: p.postText,
        likes: p.likes || 0,
        comments: p.comments || [],
        date: new Date(p.createdAt).toLocaleString(),
      }));

      setPosts(formatted);
    })
    .catch((err) => console.log(err));
}, []);


  /* ================= SAVE FUNCTION ================= */
  const savePosts = (updated) => {
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };



  /* ================= ADD POST ================= */
  const addPost = () => {
    if (newPost.trim() === "") return;

    const newItem = {
      id: Date.now(),
      name: "You",
      text: newPost,
      likes: 0,
      comments: [],
      date: lang === "hi" ? "अभी" : "Just now",
    };
   api.post("/community/add", {
  userId: user._id,   // ⭐ ADD THIS
  username: user.name || "You",
  postText: newPost,
});


    


    savePosts([newItem, ...posts]);
    setNewPost("");
  };

  /* ================= LIKE ================= */
  const likePost = (id) =>
    savePosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));

  /* ================= COMMENTS ================= */
  const addComment = (id) => {
    if (!newComment[id]?.trim()) return;

    savePosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, comments: [...p.comments, { user: "You", text: newComment[id] }] }
          : p
      )
    );

    setNewComment({ ...newComment, [id]: "" });
  };

  const startEditPost = (post) => {
    setEditingPostId(post.id);
    setEditPostText(post.text);
  };

  const saveEditedPost = (id) => {
    savePosts(posts.map((p) => (p.id === id ? { ...p, text: editPostText } : p)));
    setEditingPostId(null);
    setEditPostText("");
  };

  const deletePost = (id) => {
    if (!window.confirm(t[lang].deletePostConfirm)) return;
    savePosts(posts.filter((p) => p.id !== id));
  };

  const saveEditComment = (postId, index) => {
    if (!editComment[postId]?.[index]?.trim()) return;

    savePosts(
      posts.map((p) => {
        if (p.id === postId) {
          const comments = [...p.comments];
          comments[index].text = editComment[postId][index];
          return { ...p, comments };
        }
        return p;
      })
    );

    setEditingCommentPostId(null);
    setEditingCommentIndex(null);
  };

  const deleteComment = (postId, index) => {
    if (!window.confirm(t[lang].deleteCommentConfirm)) return;

    savePosts(
      posts.map((p) => {
        if (p.id === postId) {
          const comments = [...p.comments];
          comments.splice(index, 1);
          return { ...p, comments };
        }
        return p;
      })
    );
  };

  /* ================= UI ================= */
  return (
     <div className="community-root">
      <h2 style={{ marginBottom: 10 }}>👥 {t[lang].title}</h2>
      <p className="muted">{t[lang].subtitle}</p>

      {/* NEW POST */}
      <div className="card" style={{ marginBottom: 20 }}>
        <textarea
          placeholder={t[lang].placeholder}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          rows="3"
          style={{
            width: "100%",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(0,0,0,0.15)",
            color: "inherit",
            padding: "10px",
          }}
        />
        <button className="btn" style={{ marginTop: 10 }} onClick={addPost}>
          🚀 {t[lang].postBtn}
        </button>
      </div>

      {/* POSTS */}
      {posts.map((p) => (
        <div key={p.id} className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <b>{p.name}</b>
              <div className="small">{p.date}</div>
            </div>

            {p.name === "You" && (
              <div style={{ display: "flex", gap: "6px" }}>
                {editingPostId === p.id ? (
                  <>
                    <button className="btn" onClick={() => saveEditedPost(p.id)}>
                      💾 {t[lang].save}
                    </button>
                    <button
                      className="btn"
                      style={{ background: "#ef4444" }}
                      onClick={() => setEditingPostId(null)}
                    >
                      ✖ {t[lang].cancel}
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => startEditPost(p)}>
                      ✏️ {t[lang].edit}
                    </button>
                    <button
                      className="btn"
                      style={{ background: "#ef4444" }}
                      onClick={() => deletePost(p.id)}
                    >
                      🗑 {t[lang].delete}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {editingPostId === p.id ? (
            <textarea
              value={editPostText}
              onChange={(e) => setEditPostText(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                marginTop: 10,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(0,0,0,0.2)",
                color: "inherit",
                padding: "8px",
              }}
            />
          ) : (
            <p style={{ marginTop: 10 }}>{p.text}</p>
          )}

          {/* LIKE + COMMENT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <button className="btn" onClick={() => likePost(p.id)}>
              ❤️ {p.likes}
            </button>

            <div>
              <input
                type="text"
                placeholder={t[lang].commentPlaceholder}
                value={newComment[p.id] || ""}
                onChange={(e) =>
                  setNewComment({ ...newComment, [p.id]: e.target.value })
                }
                style={{
                  padding: "6px 10px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,.2)",
                  color: "inherit",
                  marginRight: "6px",
                }}
              />
              <button className="btn" onClick={() => addComment(p.id)}>
                💬
              </button>
            </div>
          </div>

          {/* COMMENTS */}
          {p.comments.length > 0 && (
            <div className="card" style={{ marginTop: 10 }}>
              {p.comments.map((c, i) => (
                <div key={i} className="card" style={{ marginBottom: 6 }}>
                  💭 <b>{c.user}:</b>{" "}
                  {editingCommentPostId === p.id &&
                  editingCommentIndex === i ? (
                    <>
                      <input
                        value={editComment[p.id]?.[i] || c.text}
                        onChange={(e) =>
                          setEditComment({
                            ...editComment,
                            [p.id]: {
                              ...(editComment[p.id] || {}),
                              [i]: e.target.value,
                            },
                          })
                        }
                        style={{
                          width: "70%",
                          padding: "5px",
                          borderRadius: "6px",
                        }}
                      />
                      <button
                        className="btn"
                        onClick={() => saveEditComment(p.id, i)}
                      >
                        💾
                      </button>
                    </>
                  ) : (
                    c.text
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "6px",
                      marginTop: "4px",
                    }}
                  >
                    <button
                      className="btn"
                      onClick={() => {
                        setEditingCommentPostId(p.id);
                        setEditingCommentIndex(i);
                        setEditComment({
                          ...editComment,
                          [p.id]: {
                            ...(editComment[p.id] || {}),
                            [i]: c.text,
                          },
                        });
                      }}
                    >
                      ✏️ {t[lang].edit}
                    </button>
                    <button
                      className="btn"
                      style={{ background: "#ef4444" }}
                      onClick={() => deleteComment(p.id, i)}
                    >
                      🗑 {t[lang].delete}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}