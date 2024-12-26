import React, { useState } from "react";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "./BlogPost.css";

const BlogPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const db = getFirestore();
    const postRef = doc(db, "blogPosts", post.id);

    if (!liked) {
      await updateDoc(postRef, { likes: likes + 1 });
      setLikes(likes + 1);
      setLiked(true);
    } else {
      await updateDoc(postRef, { likes: likes - 1 });
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  return (
    <div className="blog-post">
      <div className="post-header">
        <img
          src={post.profilePicUrl}
          alt={`${post.username}'s profile`}
          className="post-profile-pic"
        />
        <div>
          <h3>{post.username}</h3>
          <h4>{post.title}</h4>
        </div>
      </div>
      <p>{post.content}</p>
      <div className="post-footer">
        <button onClick={handleLike}>
          {liked ? "Unlike" : "Like"} ({likes})
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
