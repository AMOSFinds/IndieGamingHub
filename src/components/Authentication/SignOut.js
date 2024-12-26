import React, { useState } from "react";
import { auth } from "../firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../CustomAlert";
import LoadingIndicator from "../LoadingIndicator";

function SignOut() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      setAlertMessage("You have signed out successfully.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);

        navigate("/");
        setLoading(false);
      }, 3000);
    } catch (error) {
      console.error("Error signing out: ", error);
      setAlertMessage("Error signing out. Please try again.");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setLoading(false);
      }, 3000); // Hide alert after 3 seconds
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <button className="signout-btn2" onClick={handleSignOut}>
        Sign Out
      </button>
      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
}

export default SignOut;
