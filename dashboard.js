// 1. Firebase Configuration
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

/**
 * Mukhya kaaryam: Admin panel-il 'Assign Host' cheyyumpol ulla peru 
 * (Email allengil Username) thirichariyaan ulla identifier.
 */
const hostIdentifier = localStorage.getItem("hostUsername") || localStorage.getItem("hostEmail");

document.addEventListener('DOMContentLoaded', () => {
    // Current date set cheyyunnu
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    const curDateEl = document.getElementById('curDate');
    if (curDateEl) curDateEl.innerText = today;

    if (hostIdentifier) {
        loadMatches();
    } else {
        console.error("Host Identifier not found! Please login again.");
        // Session illenkil logout aakam
        // window.location.href = "index.html";
    }
});

// --- MATCHES LOAD CHEYYUNNA MAIN FUNCTION ---
function loadMatches() {
    const container = document.getElementById('matchContainer');
    const tCountText = document.getElementById('tCount');

    if (!container) return;

    /**
     * 🔥 FILTER LOGIC: 
     * Admin panel vazhi select cheytha 'assignedHost' name-um,
     * ippo login cheytha host-inte ID-yum match aavunnu undo ennu nokkunnu.
     */
    db.ref('matches').orderByChild('assignedHost').equalTo(hostIdentifier).on('value', (snap) => {
        if (!snap.exists()) {
            container.innerHTML = `
                <div style="text-align:center; padding:40px; color:#bbb;">
                    <i class="fa-solid fa-calendar-xmark" style="font-size:40px; margin-bottom:10px;"></i>
                    <p>No tournaments assigned to you yet.</p>
                </div>`;
            if (tCountText) tCountText.innerText = "0 tournaments";
            return;
        }

        container.innerHTML = "";
        let count = 0;

        snap.forEach((child) => {
            const m = child.val();
            const matchId = child.key;
            count++;

            // Time readable aayi maattunnu
            const mDate = new Date(m.time);
            const formattedTime = mDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Status Color (Optional: Time kazhinjal status maattam)
            const isEnded = new Date() > new Date(mDate.getTime() + 60 * 60000);
            const statusLabel = isEnded ? "ENDED" : "UPCOMING";
            const statusBg = isEnded ? "#888" : "#28a745";

            container.innerHTML += `
                <div class="match-card" onclick="openMatch('${matchId}')" style="cursor:pointer; animation: fadeIn 0.5s ease;">
                    <div class="m-header" style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <h3 class="m-title" style="margin:0; font-size:16px; color:#333;">${m.category}</h3>
                            <small style="color:#666; font-weight:500;">${m.teamType} | ${m.map || 'Bermuda'}</small>
                        </div>
                        <span class="status-tag" style="background:${statusBg}; color:white; padding:3px 8px; border-radius:4px; font-size:10px; font-weight:bold;">
                            ${statusLabel}
                        </span>
                    </div>
                    
                    <div class="m-footer" style="margin-top:15px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eee; padding-top:10px;">
                        <span class="tap-text" style="color:#ff4d4d; font-size:12px; font-weight:bold;">
                            <i class="fa-solid fa- door-open"></i> TAP TO OPEN
                        </span>
                        <span class="m-time-bold" style="font-size:14px; font-weight:bold; color:#333;">
                            <i class="fa-regular fa-clock"></i> ${formattedTime}
                        </span>
                    </div>
                </div>`;
        });

        if (tCountText) tCountText.innerText = `${count} tournaments`;
    });
}

function openMatch(id) {
    // Match detail card-ilekk link cheyyunnu
    window.location.href = `card.html?id=${id}`;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

// Simple Animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .match-card:active { transform: scale(0.97); transition: 0.1s; }
`;
document.head.appendChild(style);
