// Firebase Configuration
const firebaseConfig = {
   apiKey: "AIzaSyA27HdQcrgwPjlnPZifJ_BuNThLhmo9qWk",
    authDomain: "claude-todo-1.firebaseapp.com",
    projectId: "claude-todo-1",
    storageBucket: "claude-todo-1.firebasestorage.app",
    messagingSenderId: "524281746930",
    appId: "1:524281746930:web:c398287063c2df55dc076b",
    measurementId: "G-B7YKYMFS9J"
};

// Check configuration
if (firebaseConfig.apiKey ==="AIzaSyA27HdQcrgwPjlnPZifJ_BuNThLhmo9qWk") {
    console.error('⚠️ FIREBASE NOT CONFIGURED!');
    console.error('Please edit src/config/firebase.config.js and add your Firebase configuration.');
}

window.firebaseConfig = firebaseConfig;
