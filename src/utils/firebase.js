// Firebase Utilities

// Initialize Firebase
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(window.firebaseConfig);
        console.log('✅ Firebase initialized successfully');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
    }
}

const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('Persistence not available');
        }
    });

window.auth = auth;
window.db = db;
