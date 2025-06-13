import './AuthPage.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import { signUp, signIn } from "./authFunctions";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function AuthPage({ setLoggedIn, setUserId }) {
  const navigate = useNavigate(); // initialize useNavigate
  const [isSigningUp, setIsSigningUp] = useState(true); // true = Sign Up form, false = Sign In form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Update user ID when authentication changes
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
    } else {
      setUserId(null);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSigningUp) {
        await signUp(email, password);
        alert("User created successfully!");
        setLoggedIn(true); // Update loggedIn state to true on successful sign up
      } else {
        await signIn(email, password);
        setLoggedIn(true); // Update loggedIn state to true on successful sign in
        alert("Signed in successfully!");
      }

      // Redirect to Home after successful sign in or sign up
      navigate("/home"); // Redirects user to Home page
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const toggleMode = () => {
    setIsSigningUp((prev) => !prev);
  };

  return (
    <>
      <h1 className="auth-title">Welcome</h1>
      <div className='auth-box'>
        <h2>{isSigningUp ? "Create Your Account" : "Sign In"}</h2>
        <form onSubmit={handleSubmit} className='auth-form'>
          <div className="input-boxes">
            <input className='entry-box1'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input className='entry-box2'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            </div>
          <button className='button-submit' type="submit">{isSigningUp ? "Sign Up" : "Sign In"}</button>
        </form>

        <p>
          {isSigningUp ? "Already have an account?" : "Don't have an account?"}
          <button className='signIn-button' onClick={toggleMode}>
            {isSigningUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </>
  );
}

export default AuthPage;
