<!-- firebase-config.js -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBzxaMy53uTRYTc10I777TQwnJekWyujUg",
    authDomain: "ptexpertshub-b785e.firebaseapp.com",
    projectId: "ptexpertshub-b785e",
    storageBucket: "ptexpertshub-b785e.firebasestorage.app",
    messagingSenderId: "38052924664",
    appId: "1:38052924664:web:d9410b214893422542ff0d"
  };

  const app = initializeApp(firebaseConfig);

  window.auth = getAuth(app);
  window.db = getFirestore(app);
</script>
