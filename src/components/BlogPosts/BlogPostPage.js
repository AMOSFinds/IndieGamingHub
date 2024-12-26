import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  increment,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
import "./BlogPostPage.css";

const BlogPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Fetch the blog post and like count
    const fetchPost = async () => {
      try {
        const postRef = doc(db, "blogPosts", postId);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          setPost(postSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    // Listen for changes to likes subcollection
    const fetchLikesCount = () => {
      const likesRef = collection(db, `blogPosts/${postId}/likes`);
      onSnapshot(likesRef, (snapshot) => {
        setLikesCount(snapshot.size); // The size of the snapshot is the like count
      });
    };

    // Check if the current user has liked this post
    const checkUserLike = async () => {
      const user = auth.currentUser;
      if (user) {
        const likeDocRef = doc(db, `blogPosts/${postId}/likes`, user.uid);
        const likeDocSnapshot = await getDoc(likeDocRef);
        setLiked(likeDocSnapshot.exists());
      }
    };

    const fetchComments = () => {
      const commentsRef = collection(db, `blogPosts/${postId}/comments`);
      onSnapshot(commentsRef, (snapshot) => {
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      });
    };

    fetchPost();
    fetchLikesCount();
    checkUserLike();
    fetchComments();
  }, [postId, db]);

  // Handles liking/unliking the post
  const handleLike = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to like this post.");
      return;
    }

    try {
      const likeRef = doc(db, `blogPosts/${postId}/likes`, user.uid);

      if (!liked) {
        // Like the post (create a document in the likes subcollection)
        await setDoc(likeRef, {
          userId: user.uid,
          username: user.displayName || "Anonymous",
          profilePicUrl: user.photoURL || "default-profile-pic-url",
        });
        setLiked(true);
      } else {
        // Unlike the post (delete the document from the likes subcollection)
        await deleteDoc(likeRef);
        setLiked(false);
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleAddComment = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to comment.");
      return;
    }

    if (!newComment.trim()) return; // Prevent empty comments

    const commentData = {
      text: newComment,
      userId: user.uid,
      username: user.displayName || "Anonymous",
      profilePicUrl: user.photoURL || "default-profile-pic-url",
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, `blogPosts/${postId}/comments`), commentData);
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="blog-post-page">
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-post-details">
        <img
          src={post.profilePicUrl}
          alt={post.username}
          className="post-profile-pic"
        />
        <p className="blog-post-username">By {post.username}</p>
      </div>
      <p className="blog-content">{post.content}</p>

      <div className="like-button-container">
        <button
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "Unlike" : "Like"} ({likesCount})
        </button>
      </div>

      <div className="comments-section">
        <h3 className="blog-comments-title">Comments</h3>
        {auth.currentUser ? (
          <div className="comment-input-container">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <button className="post-comment-button" onClick={handleAddComment}>
              Post Comment
            </button>
          </div>
        ) : (
          <p className="blog-comments-signin">
            Please sign in to leave a comment.
          </p>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <img
                src={comment.profilePicUrl}
                alt={comment.username}
                className="comment-profile-pic"
              />
              <div>
                <p>{comment.username}</p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
