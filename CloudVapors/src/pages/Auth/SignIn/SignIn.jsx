import React, { useState } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import google from "../../../assets/svgs/google.svg";
import { auth } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/userSlice";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigate();
  const Sign_in = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("login user ======>", result.user);
      dispatch(
        setUser({
          uid: result.user,
          name: result.user?.displayName,
          email: result.user.email,
        })
      );
      navigation("/");
    } catch (err) {
      console.error("Login error:", err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google login user ======>", result.user);
      dispatch(
        setUser({
          uid: result.user,
          name: result.user?.displayName,
          email: result.user.email,
        })
      );
      navigation("/");
    } catch (error) {
      console.error("Google login error:", error.message);
    }
  };

  return (
    <div className="signin-page-main-container">
      <div className="sign-in-up"></div>
      <div className="sign-in-down"></div>

      <div className="signin-box-main">
        <div className="sigin-in-text">
          <span>Sign In</span>
          <p>Enter your email and password to sign in!</p>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src={google} alt="Google logo" />
          Sign in with Google
        </button>

        <div className="separator">or</div>

        <form onSubmit={Sign_in}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forget-password">Forgot password?</Link>
          </div>

          <button type="submit" className="sign-in-btn">
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div className="last-box">
          <p className="signup-link">
            Not registered yet? <Link to="/signup" style={{fontSize:'12px'}}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
