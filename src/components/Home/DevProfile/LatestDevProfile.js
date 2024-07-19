import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase-config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

function LatestDevProfile() {
  const [latestProfile, setLatestProfile] = useState(null);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      const q = query(
        collection(db, "developers"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setLatestProfile(snapshot.docs[0].data());
      }
    };

    fetchLatestProfile();
  }, []);

  if (!latestProfile)
    return <div className="latest-devprofile">Loading...</div>;

  return (
    <div className="latest-devprofile">
      <img
        src={latestProfile.imageUrl}
        alt={`${latestProfile.name}'s profile`}
        className="dev-image"
      />
      <h2>{latestProfile.name}</h2>
      <p>{latestProfile.bio}</p>
      <h3>Games</h3>
      <ul>
        {latestProfile.games.map((game, index) => (
          <li key={index}>{game}</li>
        ))}
      </ul>
    </div>
  );
}

export default LatestDevProfile;
