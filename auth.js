<script type="module">
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

  // SIGNUP
  window.signup = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;

    await setDoc(doc(db, "users", user.uid), {
      email: email,
      paid: false,
      createdAt: serverTimestamp()
    });

    alert("Signup successful. Wait for course access approval.");
  };

  // LOGIN
  window.login = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth, email, password);
  };

  // AUTH STATE CHECK
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return alert("User record missing");

    if (snap.data().paid === true) {
      document.getElementById("loginBox").style.display = "none";
      document.getElementById("courseContent").style.display = "block";
    } else {
      alert("Access not approved yet. Please contact admin.");
    }
  });
</script>
