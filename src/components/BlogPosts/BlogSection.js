import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import BlogPost from "./BlogPost";
import "./BlogSection.css";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const postsRef = collection(db, "blogPosts");
    const q = query(postsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="blog-section">
      <h2 className="blog-title">
        <span className="highlight">Latest Blog Posts</span>
      </h2>
      <div className="blog-cards">
        {posts.slice(0, 3).map((post) => (
          <div key={post.id} className="blog-card">
            <img
              src={
                post.headerImageUrl ? post.headerImageUrl : post.profilePicUrl
              }
              alt={post.title}
              className="blog-card-image"
            />
            <div className="blog-card-content">
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-description">
                {post.content.slice(0, 100)}... {/* Limit preview text */}
              </p>
              <Link to={`/blog/${post.id}`}>
                <button className="blog-read-more">Read More →</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <Link to="/blogpage">
        <button className="blog-create-button">See all Blogs</button>
      </Link>
    </section>
  );
};

export default BlogSection;
