const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.payTesters = functions.firestore
  .document("feedback/{feedbackId}")
  .onCreate(async (snap, context) => {
    const feedback = snap.data();
    const demoRef = doc(db, "demos", feedback.demoId);
    const demo = await getDoc(demoRef);
    const tier = demo.data().pricingTier;
    let payment = 0;
    if (tier === "pro") payment = 0.36; // $0.36/demo
    if (tier === "premium") payment = 0.3; // $0.30/demo
    // Use Paystack/Flutterwave API to pay tester (feedback.userId)
  });
