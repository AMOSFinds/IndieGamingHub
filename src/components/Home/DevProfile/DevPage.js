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
import "./DevProfileCard.css";
import LoadingIndicator from "../../LoadingIndicator";
import AllGamesData from "../AllGames/AllGameData";

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
          const gamesFromProfile = devDoc
            .data()
            .games.split(",")
            .map((game) => game.trim().toLowerCase()); // Normalize

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

          setLoading(false);

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

        // Fetch comments
        const commentsSnapshot = await getDocs(
          query(
            collection(db, "developers", user.uid, "comments"),
            orderBy("timestamp", "asc")
          )
        );

        const fetchedComments = [];
        commentsSnapshot.forEach((doc) => {
          fetchedComments.push({ id: doc.id, ...doc.data() });
        });

        // If there are no comments, set an empty array
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
    const db = getFirestore();
    const devDocRef = doc(db, "developers", user.uid);
    await updateDoc(devDocRef, editedProfile);
    setDevProfile(editedProfile);
    setIsEditing(false);
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
    if (user) {
      try {
        const commentData = {
          text: newComment,
          username: user.displayName,
          userId: user.uid,
          timestamp: new Date(),
        };

        const db = getFirestore();
        await addDoc(
          collection(db, "developers", user.uid, "comments"),
          commentData
        );
        setNewComment(""); // Clear the input field after adding a comment
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    } else {
      alert("You need to be signed in to comment.");
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
    const pollRef = doc(db, "developers", user.uid, "polls", pollId);
    const pollDoc = await getDoc(pollRef);
    const pollData = pollDoc.data();

    const updatedOptions = pollData.options.map((option, index) => {
      if (index === optionIndex) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    await updateDoc(pollRef, { options: updatedOptions });

    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId ? { ...poll, options: updatedOptions } : poll
      )
    );
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dev-view">
      {devProfile ? (
        <div className="dev-profile-card">
          <div className="dev-name">
            <h3>Developer Profile</h3>
            <button onClick={handleEditClick} className="follow-button">
              Edit
            </button>
            {user && devProfile.userId && user.uid === devProfile.userId && (
              <button onClick={handleDelete} className="delete2-button">
                Delete
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="dev-profile-edit">
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    name: e.target.value,
                  })
                }
                className="signin-input"
              />
              <textarea
                value={editedProfile.bio}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    bio: e.target.value,
                  })
                }
                className="signin-input"
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
                className="signin-input"
              />
              <button onClick={handleSaveClick} className="follow-button">
                Save
              </button>
            </div>
          ) : (
            <div className="alldevs-list">
              <img
                src={devProfile.profilePicUrl}
                alt={devProfile.name}
                className="dev-image"
              />
              <h4 className="dev-name">{devProfile.name}</h4>
              <p className="dev-bio">{devProfile.bio}</p>
              <p className="dev-bio">{devProfile.games}</p>
            </div>
          )}

          {Object.keys(analyticsData).length > 0 && (
            <div className="analytics-section">
              <h3 className="analytics-title">Analytics for Your Games</h3>
              {Object.keys(analyticsData.gameStats).map((gameName) => (
                <div key={gameName} className="game-analytics">
                  <h4>{gameName}</h4>
                  <p>
                    Average Rating:{" "}
                    {analyticsData.gameStats[gameName].averageRating}
                  </p>
                  <p>
                    Review Count:{" "}
                    {analyticsData.gameStats[gameName].reviewCount}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Dev Diaries and Updates Section */}
          <div className="dev-diaries-section">
            <h3 className="analytics-title">Dev Diaries and Updates</h3>

            {/* Only show post form if the current user is the developer */}
            {user && devProfile.userId === user.uid && (
              <div className="add-post">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="post-input"
                />
                <textarea
                  placeholder="What's new?"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="post-textarea"
                />
                <button onClick={handleAddPost} className="follow-button">
                  Add Post
                </button>
              </div>
            )}

            {/* Displaying posts */}
            {posts.length > 0 ? (
              <div className="posts-list">
                {posts.map((post) => (
                  <div key={post.id} className="post-item">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    <small>
                      Posted on:{" "}
                      {new Date(post.timestamp.toDate()).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-posts">No posts yet.</p>
            )}
          </div>

          {/* Polls and Surveys Section */}
          <div className="polls-section">
            <h3 className="analytics-title">Polls and Surveys</h3>

            {/* Only show poll creation form if the current user is the developer */}
            {user && devProfile.userId === user.uid && (
              <div className="add-poll">
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
                <button onClick={handleAddPollOption} className="follow-button">
                  Add Option
                </button>
                <button onClick={handleCreatePoll} className="delete2-button">
                  Create Poll
                </button>
              </div>
            )}

            {/* Displaying polls */}
            {polls.length > 0 ? (
              <div className="polls-list">
                {polls.map((poll) => (
                  <div key={poll.id} className="poll-item">
                    <h4>{poll.question}</h4>
                    <div className="poll-options">
                      {poll.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleVote(poll.id, index)}
                          className="poll-option"
                        >
                          {option.option} ({option.votes} votes)
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-posts">No polls yet.</p>
            )}
          </div>

          {/* Comment Section */}
          <div className="comments-section">
            <h3 className="analytics-title">Discussion</h3>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.username}</strong>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              ></textarea>
              <button className="follow-button" onClick={handleAddComment}>
                Post Comment
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-profiles">You have no developer profile.</p>
      )}
    </div>
  );
}

export default DevPage;
