import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    genres: [],
    platforms: [],
    playstyle: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError(null);
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userRef = doc(db, `users/${user.uid}`);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setPreferences(
              docSnap.data().preferences || {
                genres: [],
                platforms: [],
                playstyle: "",
              }
            );
          } else {
            console.log("No such document!");
            setPreferences({ genres: [], platforms: [], playstyle: "" });
          }
        } catch (err) {
          console.error("Error fetching preferences: ", err);
          setError(err);
        }
      } else {
        setError("No user is signed in");
      }
      setLoading(false);
    };

    fetchPreferences();
  }, []);

  return { preferences, loading, error };
};

export default useUserPreferences;
