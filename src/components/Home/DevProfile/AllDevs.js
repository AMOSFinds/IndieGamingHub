import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DevProfileCard from "./DevProfileCard";
import DevProfilePage from "./DevProfilePage";
import CustomAlert from "../../CustomAlert";
import LoadingIndicator from "../../LoadingIndicator";
import { Link } from "react-router-dom";
import "./AllDevs.css";

const itemsPerPage = 5;

function AllDevs() {
  const [devProfiles, setDevProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = devProfiles.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <LoadingIndicator />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="all-devs-container">
      <div className="dev-action-buttons">
        <Link to="/devprofile-form">
          <button className="action-btn">Create Dev Profile</button>
        </Link>
        <Link to="/devpage">
          <button className="action-btn">View Dev Profile</button>
        </Link>
      </div>
      <h2 className="all-devs-title">All Developers</h2>
      <div className="dev-cards-list">
        {devProfiles.length === 0 ? (
          <p className="no-profiles">
            No available developer profiles at this moment.
          </p>
        ) : (
          currentItems.map((dev) => <DevProfileCard key={dev.id} dev={dev} />)
        )}
      </div>
      {devProfiles.length > 0 && (
        <div className="pagination">
          {[...Array(Math.ceil(devProfiles.length / itemsPerPage))].map(
            (x, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`pagination-button ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default AllDevs;
