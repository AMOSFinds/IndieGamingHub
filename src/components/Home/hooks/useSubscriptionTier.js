import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export default function useSubscriptionTier() {
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTier = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTier(docSnap.data().subscriptionTier || "free");
        }
      }
      setLoading(false);
    };

    fetchTier();
  }, []);

  return { tier, loading };
}
