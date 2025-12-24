// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SHARED FIREBASE INSTANCES
const auth = window.auth;
const db = window.db;

// STATE
let signup = false;

// TOGGLE LOGIN / SIGNUP
window.toggleMode = () => {
  signup = !signup;

  document.getElementById("title").innerText =
    signup ? "Create Account" : "Login";

  document.getElementById("name").style.display =
    signup ? "block" : "none";

  document.querySelector(".toggle").innerText =
    signup ? "Already have an account? Login" : "New user? Create account";

  document.getElementById("msg").innerText = "";
};

// SUBMIT FORM  ✅ (THIS WAS MISSING)
window.submitForm = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();
  const msg = document.getElementById("msg");

  msg.innerText = "";

  if (!email || !password) {
    msg.innerText = "Email and password are required";
    return;
  }

  try {
    if (signup) {
      if (!name) {
        msg.innerText = "Please enter full name";
        return;
      }

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        paid: false,
        createdAt: serverTimestamp()
      });

      msg.style.color = "green";
      msg.innerText = "Account created. Wait for admin approval.";

    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (e) {
    msg.style.color = "#dc2626";
    msg.innerText = e.message;
  }
};

// AUTH STATE (LOGIN PAGE ONLY)
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  if (snap.data().paid === true) {
    window.location.href = "masterclass_index.html";
  } else {
    document.getElementById("msg").innerText =
      "Access not approved yet. Please contact admin.";
  }
});
