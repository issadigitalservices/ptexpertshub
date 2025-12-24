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

/* ---------------- TOGGLE LOGIN / SIGNUP ---------------- */
window.toggleMode = () => {
  signup = !signup;

  document.getElementById("title").innerText =
    signup ? "Create Account" : "Login";

  document.getElementById("name").style.display =
    signup ? "block" : "none";

  document.querySelector(".toggle").innerText =
    signup ? "Already have an account? Login" : "New user? Create account";

  document.getElementById("msg").innerText = "";
  hideExtras();
};

/* ---------------- SUBMIT FORM ---------------- */
window.submitForm = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();
  const msg = document.getElementById("msg");

  msg.style.color = "#dc2626";
  msg.innerText = "";

  if (!email || !password) {
    msg.innerText = "Email and password are required";
    return;
  }

  try {
    // -------- SIGNUP --------
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

      // SUCCESS MESSAGE
      msg.style.color = "green";
      msg.innerText =
        "Your account has been created successfully. You will be notified once access is approved.";

      showPendingUI(email);

      // 🔁 AUTO SWITCH TO LOGIN MODE
      setTimeout(() => {
        signup = false;
        document.getElementById("title").innerText = "Login";
        document.getElementById("name").style.display = "none";
        document.querySelector(".toggle").innerText = "New user? Create account";
      }, 2000);

    // -------- LOGIN --------
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }

  } catch (e) {
    msg.style.color = "#dc2626";
    msg.innerText = e.message;
  }
};

/* ---------------- AUTH STATE (LOGIN PAGE ONLY) ---------------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists()) return;

  // ✅ APPROVED
  if (snap.data().paid === true) {
    hideExtras();
    window.location.href = "masterclass_index.html";
    return;
  }

  // ⏳ NOT APPROVED
  const msg = document.getElementById("msg");
  msg.style.color = "#dc2626";
  msg.innerText = "Your account is pending approval.";

  showPendingUI(user.email);
});

/* ---------------- HELPERS ---------------- */

function showPendingUI(email) {
  // Badge
  const badge = document.getElementById("statusBadge");
  if (badge) badge.style.display = "block";

  // WhatsApp
  const waBox = document.getElementById("whatsappBox");
  const waLink = document.getElementById("waLink");

  if (waBox && waLink) {
    const phone = "971528553400"; // admin number (no +)
    const text = encodeURIComponent(
      `Hello Admin,\n\nI have created an account for PT Experts Masterclass.\n\nEmail: ${email}\n\nPlease approve my access.`
    );

    waLink.href = `https://wa.me/${phone}?text=${text}`;
    waBox.style.display = "block";
  }
}

function hideExtras() {
  const badge = document.getElementById("statusBadge");
  const waBox = document.getElementById("whatsappBox");

  if (badge) badge.style.display = "none";
  if (waBox) waBox.style.display = "none";
}
