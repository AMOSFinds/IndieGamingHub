import React from "react";
import { Link } from "react-router-dom";

function SignUpButton() {
  return (
    <Link to="/signup" className="signout-btn">
      Sign Up
    </Link>
  );
}

export default SignUpButton;
