import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../style/verifyNotice.scss";

const VerifyNotice = () => {

    const location = useLocation()
    const email = location.state?.email

  return (
    <section className="verify-page">
      <div className="verify-container">
        <div className="verify-card">
          <div className="verify-icon">📧</div>

          <h1 className="verify-title">Email Sent!</h1>

          <p className="verify-text">
            Verification email sent to <strong>{email}</strong>
          </p>

          <p className="verify-subtext">
            Once verified, you can log in and start using the AI.
          </p>

          <Link to="/login" className="verify-btn">
            Go to Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VerifyNotice;
