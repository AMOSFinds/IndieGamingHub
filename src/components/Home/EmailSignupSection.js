// import React, { useState } from "react";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   where,
//   setDoc,
//   doc,
// } from "firebase/firestore";
// import "./EmailSignUpSection.css";

// const EmailSignUpSection = () => {
//   const [email, setEmail] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const db = getFirestore(); // Get Firestore instance

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Check if the email already exists in the Firestore users collection
//       const q = query(collection(db, "users"), where("email", "==", email));
//       const querySnapshot = await getDocs(q);

//       if (!querySnapshot.empty) {
//         alert("You’re already signed up! You can edit your profile later.");
//         setLoading(false);
//         return;
//       }

//       // Add a placeholder user entry with email and default points
//       const placeholderUserId = `placeholder-${Date.now()}`;
//       await setDoc(doc(db, "users", placeholderUserId), {
//         email,
//       });

//       setIsSubmitted(true);
//       setEmail("");
//       alert("Thank you for signing up! Check your inbox for updates.");
//     } catch (error) {
//       console.error("Error adding email:", error);
//       alert("Failed to sign up. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="email-signup-container">
//       <h2 className="email-signup-title">Never Miss a Hidden Gem!</h2>
//       <p className="email-signup-subtext">
//         Get exclusive weekly indie game recommendations.
//       </p>
//       {!isSubmitted ? (
//         <form className="email-signup-form" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="email-input"
//             required
//           />
//           <button type="submit" className="signup-button" disabled={loading}>
//             {loading ? "Submitting..." : "Sign Up"}
//           </button>
//         </form>
//       ) : (
//         <div className="success-message">
//           🎉 Thank you for signing up! You can update your profile later.
//         </div>
//       )}
//     </section>
//   );
// };

// export default EmailSignUpSection;
