import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  query,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./DevPage.css";
import LoadingIndicator from "../../LoadingIndicator";
import AllGamesData from "../AllGames/AllGameData";
import { FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";

function DevPage() {
  const { developerId } = useParams(); // Get the developer ID from the URL
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [devProfile, setDevProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [curatedGames, setCuratedGames] = useState([]);
  const [developerGames, setDeveloperGames] = useState([]);
  const [comments, setComments] = useState([]); // Store all comments
  const [newComment, setNewComment] = useState(""); // Store new comment text
  const [isFollowing, setIsFollowing] = useState(false); // Check if the user is following
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState([""]);
  const [userVotes, setUserVotes] = useState({});
  const [showDeleteOptions, setShowDeleteOptions] = useState({});
  const [image, setImage] = useState(null); // State for storing the selected image file
  const [updates, setUpdates] = useState([]);
  const [newUpdateTitle, setNewUpdateTitle] = useState("");
  const [newUpdateContent, setNewUpdateContent] = useState("");

  useEffect(() => {
    const db = getFirestore();

    // Function to fetch comments
    const fetchComments = async (developerId) => {
      try {
        const commentsSnapshot = await getDocs(
          query(
            collection(db, `developers/${developerId}/comments`),
            orderBy("timestamp", "asc")
          )
        );

        setComments(
          commentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    // Function to fetch developer profile
    const fetchDeveloperProfile = async () => {
      try {
        const devDocRef = doc(db, "developers", developerId);
        const devDoc = await getDoc(devDocRef);

        if (devDoc.exists()) {
          const devData = devDoc.data();
          setDevProfile(devData);
          setLoading(false);

          // Fetch developer updates
          const updatesSnapshot = await getDocs(
            query(
              collection(db, "developers", developerId, "developerUpdates"),
              orderBy("timestamp", "desc")
            )
          );
          setUpdates(
            updatesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );

          // Fetch polls
          const pollsSnapshot = await getDocs(
            collection(db, "developers", developerId, "polls")
          );
          setPolls(
            pollsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );

          fetchComments(developerId);
        } else {
          console.error("Developer profile not found.");
        }
      } catch (error) {
        console.error("Error fetching developer profile:", error);
      }
    };

    // Function to check if the current user is following the developer
    const checkFollowingStatus = async (currentUser) => {
      if (currentUser) {
        try {
          const followingRef = doc(
            db,
            `users/${currentUser.uid}/following/${developerId}`
          );
          const followingDoc = await getDoc(followingRef);
          setIsFollowing(followingDoc.exists());
        } catch (error) {
          console.error("Error checking following status:", error);
        }
      }
    };

    fetchDeveloperProfile();

    // Set current user data
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);

      // Check following status after user is set
      if (currentUser) {
        checkFollowingStatus(currentUser);
      }
    });

    return () => unsubscribe();
  }, [developerId]);

  const handleEditClick = () => {
    setEditedProfile(devProfile);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!user) {
      console.error("User must be signed in to create a poll.");
      return;
    }
    setLoading(true);
    const db = getFirestore();
    const storage = getStorage();
    let profileImageUrl = devProfile.profilePicUrl; // Existing image URL

    // If a new image is selected, upload it to Firebase Storage
    if (image) {
      const storageRef = ref(
        storage,
        `profileImages/${user.uid}/${image.name}`
      );
      await uploadBytes(storageRef, image);
      profileImageUrl = await getDownloadURL(storageRef);
    }

    // Update the developer's profile in Firestore
    const devDocRef = doc(db, "developers", user.uid);
    await updateDoc(devDocRef, {
      ...editedProfile,
      profilePicUrl: profileImageUrl,
    });

    // Update the local state with new profile data
    setDevProfile({
      ...editedProfile,
      profilePicUrl: profileImageUrl,
    });
    setIsEditing(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!user) {
      console.error("User must be signed in to create a poll.");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile?"
    );
    if (confirmDelete) {
      try {
        const db = getFirestore();
        await deleteDoc(doc(db, "developers", user.uid));
        setDevProfile(null); // Optionally redirect or show a message after deletion
      } catch (err) {
        console.error("Error deleting profile: ", err);
      }
    }
  };

  const handleAddPollOption = () => {
    setNewPollOptions([...newPollOptions, ""]);
  };

  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };

  const handleCreatePoll = async () => {
    if (!user) {
      console.error("User must be signed in to create a poll.");
      return;
    }
    if (newPollQuestion && newPollOptions.filter((opt) => opt.trim()).length) {
      const db = getFirestore();
      const pollRef = await addDoc(
        collection(db, "developers", user.uid, "polls"),
        {
          question: newPollQuestion,
          options: newPollOptions.map((option) => ({
            option,
            votes: 0,
          })),
          timestamp: new Date(),
        }
      );

      setPolls([
        ...polls,
        {
          id: pollRef.id,
          question: newPollQuestion,
          options: newPollOptions.map((option) => ({ option, votes: 0 })),
        },
      ]);
      setNewPollQuestion("");
      setNewPollOptions([""]);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    const db = getFirestore();
    const pollRef = doc(db, "developers", devProfile.userId, "polls", pollId);
    const pollDoc = await getDoc(pollRef);
    const pollData = pollDoc.data();

    // Check if the user has voted before
    const previousVoteIndex = userVotes[pollId];

    // If user has voted before on this poll, decrease the vote count of the previous option
    if (previousVoteIndex !== undefined && previousVoteIndex !== optionIndex) {
      pollData.options[previousVoteIndex].votes -= 1;
    }

    // Increase the vote count of the selected option
    pollData.options[optionIndex].votes += 1;

    await updateDoc(pollRef, { options: pollData.options });

    // Update the user's vote in state
    setUserVotes((prevVotes) => ({
      ...prevVotes,
      [pollId]: optionIndex,
    }));

    // Update the poll in the UI
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId ? { ...poll, options: pollData.options } : poll
      )
    );
  };

  const handleDeletePoll = async (pollId) => {
    if (!user) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this poll?"
    );
    if (confirmDelete) {
      try {
        const db = getFirestore();
        await deleteDoc(
          doc(db, "developers", devProfile.userId, "polls", pollId)
        );
        setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
      } catch (error) {
        console.error("Error deleting poll: ", error);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddUpdate = async () => {
    if (!user || !newUpdateTitle || !newUpdateContent) return;

    const db = getFirestore();
    const newUpdate = {
      title: newUpdateTitle,
      content: newUpdateContent,
      timestamp: new Date(),
    };

    try {
      const updateRef = await addDoc(
        collection(db, "developers", user.uid, "developerUpdates"),
        newUpdate
      );

      setUpdates([{ id: updateRef.id, ...newUpdate }, ...updates]);
      setNewUpdateTitle("");
      setNewUpdateContent("");
    } catch (error) {
      console.error("Error adding update:", error);
      console.log("Current user UID:", user.uid);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this update?"
    );
    if (confirmDelete) {
      const db = getFirestore();

      try {
        await deleteDoc(
          doc(db, "developers", user.uid, "developerUpdates", updateId)
        );
        setUpdates((prevUpdates) =>
          prevUpdates.filter((update) => update.id !== updateId)
        );
      } catch (error) {
        console.error("Error deleting update:", error);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    if (!isFollowing) {
      alert("You need to follow this developer to comment.");
      return;
    }

    const db = getFirestore();
    const commentData = {
      text: newComment,
      userId: user.uid,
      username: user.displayName,
      profilePicUrl: user.photoURL || "default-profile-pic-url",
      timestamp: new Date(),
    };

    await addDoc(
      collection(db, `developers/${developerId}/comments`),
      commentData
    );

    setComments((prevComments) => [commentData, ...prevComments]);
    setNewComment(""); // Clear the input field
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      console.error("User must be signed in to delete a comment.");
      return;
    }

    try {
      const db = getFirestore();
      await deleteDoc(
        doc(db, "developers", developerId, "comments", commentId)
      );

      // Update state to remove the comment from the UI
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      console.log("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const isOwner = user?.uid === devProfile?.userId;

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dev-page">
      {devProfile ? (
        <div className="dev-profile">
          <div className="devprofile-header">
            <h3 className="all-devs-title">Developer Profile</h3>
            {isOwner && (
              <>
                <button onClick={handleEditClick} className="devedit-button">
                  Edit
                </button>
                <button onClick={handleDelete} className="devdelete-button">
                  Delete
                </button>
              </>
            )}
          </div>

          {isEditing ? (
            <div className="devprofile-edit">
              <label className="profile-title">Profile Image: </label>
              <label htmlFor="file-upload" className="custom-file-upload">
                <FaUpload /> Choose Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className="editing-input"
              />
              <textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                className="editing-input"
              />
              <button onClick={handleSaveClick} className="editing-save-button">
                Save
              </button>
            </div>
          ) : (
            <div className="devprofile-details">
              <img
                src={devProfile.profilePicUrl}
                alt={devProfile.name}
                className="devprofile-pic"
              />
              <h4 className="dev-name">{devProfile.name}</h4>
              <p className="dev-bio">{devProfile.bio}</p>
            </div>
          )}

          <div className="devpolls-section">
            <h3 className="devpoll-title">Polls and Surveys</h3>
            {isOwner && (
              <div className="devpoll-create">
                <input
                  type="text"
                  placeholder="Poll Question"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  className="poll-input"
                />
                {newPollOptions.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      handlePollOptionChange(index, e.target.value)
                    }
                    className="poll-input"
                  />
                ))}
                <button
                  className="addoption-button"
                  onClick={handleAddPollOption}
                >
                  Add Option
                </button>
                <button
                  className="createpoll-button"
                  onClick={handleCreatePoll}
                >
                  Create Poll
                </button>
              </div>
            )}
            {polls.length > 0 ? (
              <div className="devpoll-list">
                {polls.map((poll) => (
                  <div key={poll.id} className="devpoll-item">
                    <h4 className="devpoll-question">{poll.question}</h4>
                    <div className="poll-options">
                      {poll.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleVote(poll.id, index)}
                          className={`devpoll-option ${
                            userVotes[poll.id] === index ? "selected" : ""
                          }`}
                        >
                          {option.option} ({option.votes} votes)
                        </button>
                      ))}
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="polldelete2-button"
                      >
                        Delete Poll
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-polls">No polls yet.</p>
            )}
          </div>
          {/* Developer Updates Section */}
          <div className="developer-updates-section">
            <h3 className="update-title">Developer Updates</h3>
            {isOwner && (
              <div className="update-form">
                <input
                  type="text"
                  placeholder="Update Title"
                  value={newUpdateTitle}
                  onChange={(e) => setNewUpdateTitle(e.target.value)}
                  className="update-input"
                />
                <textarea
                  placeholder="Update Content"
                  value={newUpdateContent}
                  onChange={(e) => setNewUpdateContent(e.target.value)}
                  className="update-input"
                />
                <button onClick={handleAddUpdate} className="add-update-button">
                  Add Update
                </button>
              </div>
            )}
            <div className="updates-list">
              {updates.length > 0 ? (
                updates.map((update) => (
                  <div key={update.id} className="update-item">
                    <h4 className="updatelist-title">{update.title}</h4>
                    <p className="update-content">{update.content}</p>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="delete-update-button"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-updates">No updates yet.</p>
              )}
            </div>
          </div>
          <div className="developer-comments-section">
            <h3 className="comments-title">Comments</h3>
            {user ? (
              <div className="comment-input-container">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="comment-input"
                />
                <button
                  onClick={handleAddComment}
                  className="comment-submit-button"
                >
                  Add Comment
                </button>
              </div>
            ) : (
              <p className="comments-login-message">
                Please log in to leave a comment.
              </p>
            )}

            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img
                      src={comment.profilePicUrl}
                      alt={comment.username}
                      className="comment-profile-pic"
                    />
                    <div className="comment-details">
                      <h4 className="comment-username">{comment.username}</h4>
                      <p className="comment-text">{comment.text}</p>
                      {user && comment.userId === user.uid && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="delete-comment-button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments-message">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="nodevprofile">No developer profile found.</p>
      )}
    </div>
  );
}

export default DevPage;
