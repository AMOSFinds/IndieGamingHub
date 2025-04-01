import React from "react";

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">Privacy Policy</h1>
      <p className="mb-4">
        We care about your privacy. This policy outlines what data we collect
        and how we use it.
      </p>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Information We Collect
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Personal Info:</strong> Email address, Firebase UID,
          subscription tier.
        </li>
        <li>
          <strong>Usage Data:</strong> Game searches, frequency of feature use.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        How We Use Your Data
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>To personalize your experience and power your dashboard.</li>
        <li>To improve pricing accuracy through usage trends.</li>
        <li>
          To send you product updates, only if you opt in via the email
          newsletter.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Data Sharing
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          We do not sell your data. Limited third-party tools like Firebase and
          Paystack may process your info as part of platform delivery.
        </li>
        <li>
          We may disclose data to comply with legal obligations or in a business
          transfer.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Data Security
      </h2>
      <p className="mb-4">
        We use Firebase Authentication and Firestore to protect user data and
        prevent unauthorized access.
      </p>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Your Rights
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You may update or delete your account at any time.</li>
        <li>
          You can request a copy of the data we store related to your account.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Updates
      </h2>
      <p className="mb-4">
        Any changes to this policy will be updated here and users will be
        notified when necessary.
      </p>
    </div>
  );
}
