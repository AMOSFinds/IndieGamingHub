import React from "react";
import "./Footer.css";

function Terms() {
  return (
    <div className="terms-container">
      <h1 className="footer-titles">Terms & Conditions</h1>
      <p className="footer-paragraphs">
        Welcome to DevIndie. These Terms and Conditions outline the rules and
        regulations for the use of our web app, located at devindie.com. By
        accessing or using our platform, you agree to be bound by these Terms.
        If you disagree with any part of these terms, you must discontinue use
        of our services.
      </p>
      {/* Add more detailed terms here */}
      <h3 className="footer-titles">User Accounts</h3>
      <p className="footer-paragraphs">
        1. **Account Creation:** - Users must create an account to access
        certain features of the platform. By creating an account, you agree to
        provide accurate and complete information, including your email address,
        and to keep this information up to date.{" "}
        <p>
          2. **Account Security:** - You are responsible for maintaining the
          confidentiality of your account password and for any activities that
          occur under your account. You agree to notify us immediately of any
          unauthorized use of your account.
        </p>{" "}
        3. **Termination:** - We reserve the right to terminate or suspend your
        account at our discretion, without notice, if we determine that you have
        violated these Terms or engaged in any behavior that we deem harmful to
        the platform or other users.
      </p>
      <h3 className="footer-titles">User Conduct</h3>
      <p className="footer-paragraphs">
        1. **Community Guidelines:** - Users must interact respectfully within
        the community. Any form of harassment, abuse, or inappropriate behavior
        will result in account suspension or termination.
        <p>
          2. **Content Submission:** - By submitting content, including reviews,
          comments, or images, you grant us a non-exclusive, royalty-free,
          worldwide license to use, display, and distribute your content on our
          platform.
        </p>{" "}
        3. **Prohibited Activities:** - You agree not to engage in activities
        such as: - Posting misleading or false information. - Attempting to
        hack, disrupt, or damage the platform. - Using the platform for any
        unlawful purposes.
      </p>
      <h3 className="footer-titles">Intellectual Property</h3>
      <p className="footer-paragraphs">
        1. **Platform Content:** - All content, including text, graphics, logos,
        and software, is the property of Indie Game Discovery Hub or its content
        suppliers and is protected by copyright, trademark, and other
        intellectual property laws.{" "}
        <p>
          2. **User-Generated Content:** - Users retain ownership of their
          content but grant us the right to use it as described in the Content
          Submission section.
        </p>
      </p>
      <h3 className="footer-titles">Disclaimers and Limitation of Liability</h3>
      <p className="footer-paragraphs">
        1. **Disclaimer of Warranties:** - The platform is provided "as is"
        without warranties of any kind, either express or implied. We do not
        warrant that the platform will be uninterrupted, error-free, or secure.
        <p>
          2. **Limitation of Liability:** - In no event shall DevIndie be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising out of your use of the platform.
        </p>
      </p>
      <h3 className="footer-titles">Changes to Terms</h3>
      <p className="footer-paragraphs">
        We reserve the right to update these Terms and Conditions at any time.
        Your continued use of the platform after changes are posted constitutes
        your acceptance of the new terms.
      </p>
    </div>
  );
}

export default Terms;
