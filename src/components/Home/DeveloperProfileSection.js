import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import SimpleDevProfileCard from "./DevProfile/SimpleDevProfileCard";
import "./DeveloperProfileSection.css"; // Add CSS for styling

function DeveloperProfileSection() {
  const [devProfiles, setDevProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevProfiles = async () => {
      setLoading(true);
      setError(null);
      const db = getFirestore();
      const devProfilesRef = collection(db, "developers");
      const q = query(devProfilesRef, orderBy("name"));
      try {
        const snapshot = await getDocs(q);
        const devs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDevProfiles(devs);
      } catch (err) {
        console.error("Error fetching developer profiles: ", err);
        setError(err);
      }
      setLoading(false);
    };

    fetchDevProfiles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="developer-profile-section">
      <div className="showcase-page">
        <div>
          <h1 className="tagline">Meet the Minds Behind the Games</h1>
          <p className="description">
            Go behind the scenes and connect with the creators with DevIndie's
            Developer Profiles. Each profile showcases the studio's history,
            game portfolio, and the passionate individuals behind the pixels.
            Learn about their creative processes, developmental challenges, and
            success stories. Supporting indie developers is more than just
            playing their games—it's about connecting with their stories and
            supporting their dreams.
          </p>
        </div>
      </div>
      <h2 className="featured-title">Featured Developers</h2>
      <h4 className="showcase-profile">Showcase profiles</h4>
      <div className="developer-carousel">
        {devProfiles.slice(0, 5).map((dev) => (
          <SimpleDevProfileCard key={dev.id} dev={dev} />
        ))}
      </div>
    </section>
  );
}

export default DeveloperProfileSection;
