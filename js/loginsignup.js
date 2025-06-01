import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAXQUjQmWLHbTgIj2Y4qjboYsIMtJmT-IM",
  authDomain: "movies-6c6f6.firebaseapp.com",
  projectId: "movies-6c6f6",
  storageBucket: "movies-6c6f6.firebasestorage.app",
  messagingSenderId: "379478057449",
  appId: "1:379478057449:web:91a02cf901a9ab072c6b78",
  measurementId: "G-Q95F50QR4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Toggle Logic
let isLogin = true;
const formTitle     = document.getElementById("form-title");
const confirmGroup  = document.getElementById("confirm-group");
const submitBtn     = document.getElementById("submit-btn");
const toggleMode    = document.getElementById("toggle-mode");
const authForm      = document.getElementById("auth-form");

toggleMode.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent       = "Login";
    confirmGroup.classList.remove("show");
    submitBtn.textContent       = "Login";
    toggleMode.innerHTML        = `Don't have an account? <a href="#">Sign Up</a>`;
  } else {
    formTitle.textContent       = "Sign Up";
    confirmGroup.classList.add("show");
    submitBtn.textContent       = "Sign Up";
    toggleMode.innerHTML        = `Already have an account? <a href="#">Login</a>`;
  }
});

// Login or Signup
authForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email      = document.getElementById("auth-email").value.trim();
  const password   = document.getElementById("auth-password").value;
  const confirmPass= document.getElementById("auth-confirm").value;

  // If signing up, check passwords match
  if (!isLogin && password !== confirmPass) {
    return alert("❌ Passwords do not match.");
  }

  if (isLogin) {
    // Log in existing user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        alert("✅ Logged in as " + userCred.user.email);
        // Redirect to dashboard.html (absolute path)
        window.location.href = "/dashboard.html";
      })
      .catch((err) => alert("❌ Login failed: " + err.message));
  } else {
    // Create new user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        alert("✅ Registered as " + userCred.user.email);
        // Redirect to dashboard.html (absolute path)
        window.location.href = "/dashboard.html";
      })
      .catch((err) => alert("❌ Signup failed: " + err.message));
  }
});

// Forgot Password
document.getElementById("forgot-password").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("auth-email").value.trim();

  if (!email) {
    alert("⚠️ Please enter your email above to receive a reset link.");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("📧 Password reset email sent to " + email);
    })
    .catch((error) => {
      alert("❌ Failed to send reset email: " + error.message);
    });
});

// Google Login
document.getElementById("google-login").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert("✅ Google Login Successful as " + result.user.email);
      // Redirect to dashboard.html (absolute path)
      window.location.href = "/dashboard.html";
    })
    .catch((error) => {
      alert("❌ Google Sign-In Failed: " + error.message);
    });
});
