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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const hostIdentifier = localStorage.getItem("hostUsername") || localStorage.getItem("hostEmail");

document.addEventListener('DOMContentLoaded', () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    const curDateEl = document.getElementById('curDate');
    if (curDateEl) curDateEl.innerText = today;

    if (hostIdentifier) {
        loadMatches();
    }
});

function loadMatches() {
    const container = document.getElementById('matchContainer');
    const tCountText = document.getElementById('tCount');

    if (!container) return;

    db.ref('matches').orderByChild('assignedHost').equalTo(hostIdentifier).on('value', (snap) => {
        if (!snap.exists()) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:#bbb;"><p>No tournaments assigned.</p></div>`;
            if (tCountText) tCountText.innerText = "0 tournaments";
            return;
        }

        let matchesArray = [];
        snap.forEach((child) => {
            matchesArray.push({
                key: child.key,
                ...child.val()
            });
        });

        matchesArray.sort((a, b) => new Date(a.time) - new Date(b.time));

        container.innerHTML = "";
        let count = matchesArray.length;

        matchesArray.forEach((m) => {
            const matchId = m.key;
            const mDate = new Date(m.time);
            const formattedTime = mDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            /** * STATUS & COLOR LOGIC
             * Upcoming = Green | Started = Red | Ended = Black | Completed = Rainbow
             */
            let statusValue = (m.status || "upcoming").toLowerCase();
            let statusLabel = "UPCOMING";
            let statusBg = "#28a745"; // Default Green
            let statusClass = ""; 

            if (statusValue === "started") {
                statusLabel = "STARTED";
                statusBg = "#ff0000"; // Red
            } else if (statusValue === "ended") {
                statusLabel = "ENDED";
                statusBg = "#000000"; // Black
            } else if (statusValue === "completed") {
                statusLabel = "WIN ADDED";
                statusClass = "rainbow-status"; // Triggers CSS Animation
            }

            container.innerHTML += `
                <div class="match-card" onclick="openMatch('${matchId}')" style="cursor:pointer; animation: fadeIn 0.5s ease; border-left: 5px solid ${statusClass ? 'purple' : statusBg};">
                    <div class="m-header" style="display:flex; justify-content:space-between; align-items:start;">
                        <div>
                            <h3 class="m-title" style="margin:0; font-size:16px; color:#333;">${m.category}</h3>
                            <small style="color:#666; font-weight:500;">${m.teamType} | ${m.map || 'Bermuda'}</small>
                        </div>
                        <span class="status-tag ${statusClass}" style="background:${statusBg}; color:white; padding:4px 10px; border-radius:4px; font-size:10px; font-weight:bold;">
                            ${statusLabel}
                        </span>
                    </div>
                    <div class="m-footer" style="margin-top:15px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #eee; padding-top:10px;">
                        <span class="tap-text" style="color:#ff4d4d; font-size:12px; font-weight:bold;">
                            <i class="fa-solid fa-door-open"></i> TAP TO OPEN
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
    window.location.href = `card.html?id=${id}`;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

// All Animations & Rainbow CSS Added here
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .match-card:active { transform: scale(0.97); transition: 0.1s; }

    .rainbow-status {
        background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3) !important;
        background-size: 400% 400% !important;
        animation: rainbowEffect 3s ease infinite !important;
        border: none;
    }

    @keyframes rainbowEffect {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

