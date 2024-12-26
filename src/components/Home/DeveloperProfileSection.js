import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import SimpleDevProfileCard from "./DevProfile/SimpleDevProfileCard";
import "./DeveloperProfileSection.css";
import { Link } from "react-router-dom";
import LoadingIndicator from "../LoadingIndicator";

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

  const featuredProfiles = devProfiles.slice(0, 6);
  // const latestProfiles = devProfiles.slice(-7);

  // if (loading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <section className="developer-profile-section">
      <div className="developer-carousel-section">
        <h3 className="carousel-title">Featured Developers</h3>
        <div className="carousel">
          {featuredProfiles.map((dev) => (
            <SimpleDevProfileCard key={dev.id} dev={dev} />
          ))}
        </div>
        <Link to="/all-devs">
          <button className="see-all-button">See All Developers</button>
        </Link>
      </div>

      {/* <div className="developer-carousel-section">
        <h3 className="carousel-title">Latest Added Developers</h3>

        <div id="developer-carousel" className="carousel">
          {latestProfiles.map((dev) => (
            <SimpleDevProfileCard key={dev.id} dev={dev} />
          ))}
        </div>
      </div> */}
    </section>
  );
}

export default DeveloperProfileSection;
