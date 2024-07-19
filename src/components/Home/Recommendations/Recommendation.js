import React from "react";
import UserPreferencesForm from "./UserPreferencesForm";

function Recommendation() {
  return (
    <div className="recommendation-page">
      <div className="leftpage">
        <h1 className="tagline">Games Tailored to Your Taste</h1>
        <p className="description">
          Get personalized game recommendations that match your play style and
          preferences with our smart discovery system. The more you play, the
          better our recommendations get. DevIndie learns from your interactions
          to suggest games that you're bound to love, helping you navigate the
          vast world of indie gaming without feeling overwhelmed. Start your
          personalized gaming journey today and see where it takes you!
        </p>
      </div>

      <div className="rightpage">
        <UserPreferencesForm />
      </div>
    </div>
  );
}

export default Recommendation;
