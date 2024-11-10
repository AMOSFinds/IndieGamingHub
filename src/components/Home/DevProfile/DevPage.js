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

function DevPage() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [devProfile, setDevProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [curatedGames, setCuratedGames] = useState([]);
  const [developerGames, setDeveloperGames] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [polls, setPolls] = useState([]);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState([""]);
  const [userVotes, setUserVotes] = useState({});
  const [showDeleteOptions, setShowDeleteOptions] = useState({});
  const [image, setImage] = useState(null); // State for storing the selected image file

  useEffect(() => {
    const handlePostUpdate = async (content) => {
      const db = getFirestore();
      const updateData = {
        content,
        timestamp: new Date(),
      };

      try {
        // Save the update to the developer's DevPage
        await addDoc(
          collection(db, "developers", user.uid, "updates"),
          updateData
        );

        // Notify followers
        const followersSnapshot = await getDocs(
          collection(db, "developers", user.uid, "followers")
        );
        followersSnapshot.forEach(async (doc) => {
          const followerId = doc.id;
          const followerNotificationsRef = doc(
            db,
            "users",
            followerId,
            "notifications",
            user.uid
          );
          await setDoc(
            followerNotificationsRef,
            {
              developerId: user.uid,
              developerName: devProfile.name,
              hasUnread: true,
              lastUpdate: new Date(),
            },
            { merge: true }
          );
        });
      } catch (error) {
        console.error("Error posting update: ", error);
      }
    };

    const fetchPosts = async (user) => {
      setLoading(true);
      const db = getFirestore();

      try {
        const postsSnapshot = await getDocs(
          query(
            collection(db, "developers", user.uid, "posts"),
            orderBy("timestamp", "desc")
          )
        );
        const fetchedPosts = [];
        postsSnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async (user) => {
      setLoading(true);
      const db = getFirestore();

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        const devDoc = await getDoc(doc(db, "developers", user.uid));
        if (devDoc.exists()) {
          // Retrieve games as an array directly
          const gamesFromProfile = devDoc.data().games || []; // Set default empty array if games is undefined

          setDevProfile(devDoc.data());
          setDeveloperGames(gamesFromProfile);

          // Fetch polls/surveys
          const pollsSnapshot = await getDocs(
            collection(db, "developers", user.uid, "polls")
          );
          const pollsData = pollsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPolls(pollsData);

          // Fetch the followers count
          const followersSnapshot = await getDocs(
            collection(db, "developers", user.uid, "followers")
          );
          const followersCount = followersSnapshot.size;

          // Fetch the analytics data for each game
          const gameStats = {};
          for (const gameName of gamesFromProfile) {
            const matchingGame = AllGamesData.find(
              (game) => game.title.trim().toLowerCase() === gameName
            );

            if (matchingGame) {
              const gameId = matchingGame.id;
              const gameDoc = await getDoc(doc(db, "games", gameId.toString()));

              if (gameDoc.exists()) {
                const ratings = gameDoc.data().ratings || {};
                const reviewsSnapshot = await getDocs(
                  collection(db, "games", gameId.toString(), "reviews")
                );
                const reviewCount = reviewsSnapshot.size;

                const averageRating =
                  (ratings.verygood || 0) * 5 +
                  (ratings.good || 0) * 4 +
                  (ratings.decent || 0) * 3 +
                  (ratings.bad || 0) * 2;

                const totalRatings =
                  (ratings.verygood || 0) +
                  (ratings.good || 0) +
                  (ratings.decent || 0) +
                  (ratings.bad || 0);

                gameStats[matchingGame.title] = {
                  averageRating: totalRatings
                    ? (averageRating / totalRatings).toFixed(1)
                    : "No ratings yet",
                  reviewCount,
                };
              }
            }
          }

          setAnalyticsData({ followers: followersCount, gameStats });
        }

        // Fetch comments for the developer
        const commentsSnapshot = await getDocs(
          query(
            collection(db, "developers", user.uid, "comments"),
            orderBy("timestamp", "asc")
          )
        );
        const fetchedComments = commentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching data:", error);
        // If there's an error or the document doesn't exist, ensure the loading state is still set to false
      } finally {
        setLoading(false); // Always set loading to false after fetching
      }
    };

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser);
        fetchPosts(currentUser); // Fetch posts for the developer
        setCuratedGames(AllGamesData);
      } else {
        setLoading(false); // Ensure loading is set to false if there's no current user
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = () => {
    setEditedProfile(devProfile);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
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

  const handleAddComment = async () => {
    if (!newComment) return;

    const db = getFirestore();
    const commentData = {
      text: newComment,
      username: user.displayName,
      profilePicUrl: user.photoURL || "default-profile-pic-url",
      timestamp: new Date(),
    };

    try {
      await addDoc(
        collection(db, "developers", devProfile.userId, "comments"),
        commentData
      );
      setComments((prevComments) => [commentData, ...prevComments]);
      setNewComment(""); // Clear the input field after adding a comment
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const db = getFirestore();

    try {
      await deleteDoc(
        doc(db, "developers", devProfile.userId, "comments", commentId)
      );
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const handleAddPost = async () => {
    if (!newPostTitle || !newPostContent) {
      alert("Please fill in both the title and content.");
      return;
    }

    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        timestamp: new Date(),
      };

      await addDoc(collection(db, "developers", user.uid, "posts"), newPost);

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error("Error adding post: ", error);
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

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dev-page">
      {devProfile ? (
        <div className="dev-profile">
          <div className="devprofile-header">
            <h3 className="all-devs-title">Developer Profile</h3>
            <button onClick={handleEditClick} className="devedit-button">
              Edit
            </button>
            {user.uid === devProfile.userId && (
              <button onClick={handleDelete} className="devdelete-button">
                Delete
              </button>
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
                onChange={handleImageChange} // Handler for image selection
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
              <input
                type="text"
                value={editedProfile.games}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    games: e.target.value,
                  })
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
            {user.uid === devProfile.userId && (
              <div className="devpoll-create">
                <input
                  type="text"
                  placeholder="Poll Question"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                />
                {newPollOptions.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      setNewPollOptions(
                        newPollOptions.map((opt, idx) =>
                          idx === index ? e.target.value : opt
                        )
                      )
                    }
                  />
                ))}
                <button onClick={handleAddPollOption}>Add Option</button>
                <button onClick={handleCreatePoll}>Create Poll</button>
              </div>
            )}
            {polls.length > 0 ? (
              <div className="devpoll-list">
                {polls.map((poll) => (
                  <div key={poll.id} className="devpoll-item">
                    <h4 className="devpoll-question">{poll.question}</h4>
                    {/* Poll options with voting functionality */}
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

                    {/* Show delete button only for the poll creator */}
                    {user && devProfile.userId === user.uid && (
                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="delete2-button"
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
        </div>
      ) : (
        <p className="nodevprofile">No developer profile found.</p>
      )}
    </div>
  );
}

export default DevPage;
