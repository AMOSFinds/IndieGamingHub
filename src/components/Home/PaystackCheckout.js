import React from "react";
import { PaystackButton } from "react-paystack";
import { auth, db } from "../firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PaystackCheckout({ plan }) {
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleSuccess = async (reference) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { subscriptionTier: plan }, { merge: true });

      alert(`Payment Successful! Your plan: ${plan}`);
      window.location.reload();
    }
  };

  const handlePreCheck = () => {
    if (!user) {
      alert("You must be signed in to upgrade your plan.");
      navigate("/signup");
    }
  };

  const componentProps = {
    email: user?.email || "example@email.com",
    amount: plan === "pro" ? 9500 : 55300,
    currency: "ZAR",
    publicKey,
    text: `Subscribe to ${plan}`,
    onSuccess: handleSuccess,
    onClose: () => alert("Transaction was not completed"),
    className:
      "bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition",
  };

  return (
    <div className="mt-4 text-center">
      {user ? (
        <PaystackButton {...componentProps} />
      ) : (
        <button
          onClick={handlePreCheck}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
        >
          Subscribe to {plan.charAt(0).toUpperCase() + plan.slice(1)}
        </button>
      )}
    </div>
  );
}
