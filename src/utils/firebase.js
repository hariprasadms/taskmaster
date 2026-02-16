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

// User Management Functions
const userManager = {
    // Create user document on signup
    createUserDocument: async (user, displayName = '') => {
        try {
            const userRef = db.collection('users').doc(user.uid);
            const userDoc = await userRef.get();
            
            if (!userDoc.exists) {
                await userRef.set({
                    uid: user.uid,
                    email: user.email,
                    displayName: displayName || user.email.split('@')[0],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: user.photoURL || '',
                    settings: {
                        theme: 'light',
                        notifications: true,
                        emailUpdates: false
                    }
                });
                console.log('✅ User document created');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error creating user document:', error);
            throw error;
        }
    },

    // Update last login time
    updateLastLogin: async (userId) => {
        try {
            await db.collection('users').doc(userId).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Last login updated');
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    },

    // Get user data
    getUserData: async (userId) => {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                return userDoc.data();
            }
            return null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    // Update user profile
    updateUserProfile: async (userId, updates) => {
        try {
            await db.collection('users').doc(userId).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ User profile updated');
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    // Update user settings
    updateSettings: async (userId, settings) => {
        try {
            await db.collection('users').doc(userId).update({
                settings: settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Settings updated');
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    }
};

window.auth = auth;
window.db = db;
window.userManager = userManager;

