import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./BlogPostForm.css";

const BlogPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null); // Track authenticated user
  const [headerImage, setHeaderImage] = useState(null);
  const [headerImageName, setHeaderImageName] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setHeaderImage(e.target.files[0]);
      setHeaderImageName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be signed in to post a blog.");
      return;
    }

    if (!title || !content) {
      alert("Please fill in both the title and content fields.");
      return;
    }

    setLoading(true);

    let headerImageUrl = "";

    try {
      if (headerImage) {
        const imageRef = ref(
          storage,
          `blogHeaders/${Date.now()}_${headerImage.name}`
        );
        await uploadBytes(imageRef, headerImage);
        headerImageUrl = await getDownloadURL(imageRef);
      }

      const newPost = {
        userId: user.uid,
        username: user.displayName || "Anonymous",
        profilePicUrl: user.photoURL || "/path-to-default-profile-pic.png",
        title,
        content,
        headerImageUrl: headerImageUrl || "",
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
      };

      await addDoc(collection(db, "blogPosts"), newPost);
      alert("Blog post submitted successfully!");

      // Reset form
      setTitle("");
      setContent("");
      setHeaderImage(null);
    } catch (error) {
      console.error("Error adding blog post:", error);
      alert("There was an error posting your blog. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blog-post-form-container">
      {user ? (
        <form onSubmit={handleSubmit} className="blog-post-form">
          <h2>Create a New Blog Post</h2>
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
          <textarea
            placeholder="Write your blog post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-textarea"
          ></textarea>

          <div className="file-upload-wrapper">
            <label htmlFor="header-image" className="file-upload-label">
              {headerImageName || "Upload Blog Header Image"}
            </label>
            <input
              type="file"
              id="header-image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-file-input"
            />
          </div>

          <button type="submit" className="form-submit-button">
            Post
          </button>
        </form>
      ) : (
        <div className="login-message">
          <p>
            Please <a href="/signin">log in</a> to create a blog post.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPostForm;
