import React from "react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">
        Terms & Conditions
      </h1>
      <p className="mb-4">
        Welcome to our AI-Powered Game Pricing Platform. By accessing or using
        our website and services, you agree to the terms outlined below. If you
        disagree with any part, please discontinue use.
      </p>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        User Accounts
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Account Creation:</strong> You must create an account to use
          core features. Provide accurate and current information.
        </li>
        <li>
          <strong>Security:</strong> You are responsible for keeping your
          credentials secure.
        </li>
        <li>
          <strong>Termination:</strong> We may suspend or terminate accounts
          violating terms.
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Usage & Subscriptions
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Access to features like pricing analytics and download tools are
          subject to your subscription tier.
        </li>
        <li>You may upgrade or cancel your plan at any time.</li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Prohibited Activities
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>No scraping or automation abuse.</li>
        <li>
          No uploading malicious files or tampering with platform systems.
        </li>
        <li>No impersonation or fraudulent behavior.</li>
      </ul>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Intellectual Property
      </h2>
      <p className="mb-4">
        All platform content, design, and functionality are protected under
        copyright. You may not copy, reproduce, or reverse-engineer without
        permission.
      </p>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        We are not liable for indirect losses from using the platform. We do not
        guarantee uninterrupted service.
      </p>

      <h2 className="text-xl font-semibold text-purple-400 mt-6 mb-2">
        Changes to Terms
      </h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Significant
        changes will be communicated via email or notifications.
      </p>
    </div>
  );
}
