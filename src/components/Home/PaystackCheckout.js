import React from "react";
import { PaystackButton } from "react-paystack";
import { auth, db } from "../firebase/firebase-config";
import { doc, setDoc } from "firebase/firestore";

export default function PaystackCheckout({ plan }) {
  const publicKey = "pk_test_bb6112ce981b89dc74aa16b8db3f46160fb0419c"; // Replace with your Paystack Public Key
  const user = auth.currentUser;

  const handleSuccess = async (reference) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { subscriptionTier: plan }, { merge: true });

      alert(`Payment Successful! Your plan: ${plan}`);
      window.location.reload();
    }
  };

  const componentProps = {
    email: user ? user.email : "example@email.com",
    amount: plan === "pro" ? 53900 : 183900, // R539 / R1,839 in cents
    currency: "ZAR", // Must match your Paystack account currency
    publicKey,
    text: `Subscribe to ${plan}`,
    onSuccess: (reference) => handleSuccess(reference),
    onClose: () => alert("Transaction was not completed"),
  };

  return (
    <PaystackButton
      {...componentProps}
      className="bg-teal-500 text-white px-4 py-2 rounded-lg"
    />
  );
}
