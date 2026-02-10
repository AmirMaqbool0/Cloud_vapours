import React, { useState } from "react";
import "./style.css";
import google from "../../../assets/svgs/google.svg";
import { app, auth, googleProvider } from "../../../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const db = getFirestore(app); 

  const signUpWithEmail = async () => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      const userData = {
        uid: user.uid,
        firstName,
        lastName,
        email,
        authProvider: "email",
      };

      await addDoc(collection(db, "users"), userData);
      navigation("/");
    } catch (error) {
      console.error("Error signing up with email:", error.message);
    }
    setLoading(false);
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const userData = {
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email,
          authProvider: "google",
        };

        await addDoc(usersRef, userData);
        navigation("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="sign-up-page-main-container">
      <div className="signup-top"></div>
      <div className="sign-up-bottom"></div>
      <div className="signup-main-box">
        <div className="sign-up-heading">
          <span>Sign Up</span>
          <p>Enter your email and password to sign up!</p>
        </div>

        <div className="google-button">
          <button onClick={signUpWithGoogle}>
            <img src={google} alt="Google icon" />
            <span>Sign up with Google</span>
          </button>
        </div>

        <div className="spectator">
          <p>or</p>
        </div>

        <div className="signup-name-main-box">
          <div className="first-input">
            <span>First Name</span>
            <input
              type="text"
              placeholder="Enter Your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="first-input">
            <span>Last Name</span>
            <input
              type="text"
              placeholder="Enter Your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="signup-email-box">
          <span>Email*</span>
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="signup-email-box">
          <span>Password*</span>
          <input
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="check-book-term-and-condition">
          <div className="input-checkbox">
            <input type="checkbox" />
          </div>
          <div className="text-of-privcy">
            <span>
              By creating an account you agree to the{" "}
              <b>Terms and Conditions</b> and our <b>Privacy Policy</b>.
            </span>
          </div>
        </div>

        <div className="sign-up-button">
          <button onClick={signUpWithEmail}>
            {loading ? "Loading..." : "Create my account"}
          </button>
        </div>

        <div className="already-a-member-text">
          <span>
            Already a member?{" "}
            <Link
              to={"/signin"}
              style={{ textDecoration: "none", color: "black" }}
            >
              {" "}
              <b>Sign in</b>{" "}
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
