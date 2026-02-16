// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check configuration
if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.error('⚠️ FIREBASE NOT CONFIGURED!');
    console.error('Please edit src/config/firebase.config.js and add your Firebase configuration.');
}

window.firebaseConfig = firebaseConfig;
