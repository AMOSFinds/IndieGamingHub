import React from "react";
import "./Footer.css";

function Privacy() {
  return (
    <div className="privacy-container">
      <h1 className="footer-titles">Privacy Policy</h1>
      <p className="footer-paragraphs">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your personal information...
      </p>
      {/* Add more detailed privacy information here */}
      <h3 className="footer-titles">Information We Collect</h3>
      <p className="footer-paragraphs">
        1. **Personal Information:** - When you create an account, we collect
        the following information: - Email Address - Password (encrypted) -
        Profile Picture (if provided){" "}
        <p>
          2. **Automatically Collected Information:** - We may collect certain
          information automatically, such as your IP address, browser type, and
          usage data, to improve our platform and user experience.
        </p>
      </p>
      <h3 className="footer-titles">How We Use Your Information</h3>
      <p className="footer-paragraphs">
        1. **To Provide and Improve Our Services:** - We use your information to
        create and manage your account, personalize your experience, and improve
        the platform's functionality.
        <p>
          2. **For Communication:** - We may use your email address to send you
          updates, newsletters, or important notices about your account.
        </p>{" "}
        3. **For Security Purposes:** - We may use your information to detect
        and prevent fraud or other harmful activities on the platform.
      </p>
      <h3 className="footer-titles">Sharing Your Information</h3>
      <p className="footer-paragraphs">
        1. **Third-Party Service Providers:** - We may share your information
        with third-party service providers who assist us in operating the
        platform, such as hosting services, but only to the extent necessary for
        them to perform their functions.{" "}
        <p>
          2. **Legal Requirements:** - We may disclose your information if
          required by law or if we believe such action is necessary to comply
          with legal obligations or protect our rights.
        </p>
      </p>
      <h3 className="footer-titles">Data Security</h3>
      <p className="footer-paragraphs">
        We implement reasonable security measures to protect your personal
        information. However, please note that no method of transmission over
        the internet or electronic storage is completely secure.
      </p>
      <h3 className="footer-titles">Your Rights and Choices</h3>
      <p className="footer-paragraphs">
        1. **Access and Update Information:** - You can access and update your
        personal information through your profile account.{" "}
        <p>
          2. **Delete Your Account:** - You can delete your account at any time.
          Your account and personal information will then be removed, except
          where retention is required by law.
        </p>
      </p>
      <h3 className="footer-titles">Changes to Privacy Policy</h3>
      <p className="footer-paragraphs">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page, and we will notify you of significant changes via
        email or through the platform.
      </p>
    </div>
  );
}

export default Privacy;
