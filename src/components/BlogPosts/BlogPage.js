import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./BlogPage.css";

const itemsPerPage = 4;

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const db = getFirestore();
      const blogPostsRef = collection(db, "blogPosts");
      const q = query(blogPostsRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogPosts(posts);
    };

    fetchBlogPosts();
  }, []);

  // Pagination logic
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);
  const pageCount = Math.ceil(blogPosts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="blog-page">
      <h1 className="page-title">Blog Posts</h1>
      <div className="blog-posts-list">
        {currentPosts.map((post) => (
          <div key={post.id} className="blogpage-card">
            <img
              src={
                post.headerImageUrl ? post.headerImageUrl : post.profilePicUrl
              }
              alt={post.title}
              className="blog-card-image"
            />
            <h2>{post.title}</h2>
            <p className="blog-snippet">{post.content.substring(0, 150)}...</p>
            <button
              className="read-more-button"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              Read More
            </button>
          </div>
        ))}
      </div>
      <div className="create-blog-button">
        <Link to="/blogform">
          <button className="blog-create-button">Create a Blog</button>
        </Link>
      </div>

      {/* Pagination Buttons */}
      <div className="pagination">
        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`pagination-button ${
              i + 1 === currentPage ? "active" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
