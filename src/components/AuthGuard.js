import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase-config";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (!user) return null;

  return children;
}
