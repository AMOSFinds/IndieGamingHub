import React from "react";
import { Link } from "react-router-dom";

function SignInButton() {
  return (
    <Link to="/signin" className="signout-btn">
      Sign In
    </Link>
  );
}

export default SignInButton;
