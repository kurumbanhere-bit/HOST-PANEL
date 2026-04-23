// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyAo9KNsWnq2AgoCGzPuCsg7YCbuw8-Apuo",
  authDomain: "studio-4988500581-b9772.firebaseapp.com",
  databaseURL: "https://studio-4988500581-b9772-default-rtdb.firebaseio.com",
  projectId: "studio-4988500581-b9772",
  storageBucket: "studio-4988500581-b9772.firebasestorage.app",
  messagingSenderId: "773461302160",
  appId: "1:773461302160:web:13deb67b24b267ac0b7115"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Check if already logged in
if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "dashboard.html";
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value.trim();
    const pass = document.getElementById('password').value.trim();
    const submitBtn = document.getElementById('submitBtn');
    const statusMsg = document.getElementById('statusMsg');

    submitBtn.innerText = "VERIFYING...";
    submitBtn.disabled = true;

    // Firebase-il ninnu approved hosts-ne mathram check cheyyunnu
    db.ref('approved_hosts').once('value', (snapshot) => {
        let isAuthenticated = false;
        
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                
                // Admin set cheytha username/email and password compare cheyyunnu
                if ((userData.username === userId || userData.email === userId) && userData.password === pass) {
                    isAuthenticated = true;
                }
            });
        }

        if (isAuthenticated) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("hostEmail", userId);
            statusMsg.innerText = "Login Successful! Redirecting...";
            statusMsg.style.color = "#2ecc71";
            setTimeout(() => { window.location.href = "dashboard.html"; }, 800);
        } else {
            alert("Access Denied! Your account is not approved or credentials wrong.");
            submitBtn.innerText = "ACCESS PANEL";
            submitBtn.disabled = false;
            statusMsg.innerText = "Login Failed.";
            statusMsg.style.color = "red";
        }
    }).catch((error) => {
        alert("Database Error: " + error.message);
        submitBtn.disabled = false;
        submitBtn.innerText = "ACCESS PANEL";
    });
});
