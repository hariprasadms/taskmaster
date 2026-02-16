// Settings Page Component
const SettingsPage = ({ user, onBack }) => {
    const { useState, useEffect } = React;
    const db = window.db;
    const userManager = window.userManager;
    const [userData, setUserData] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [settings, setSettings] = useState({
        theme: 'light',
        notifications: true,
        emailUpdates: false
    });
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user data
    useEffect(() => {
        if (!user) return;

        const loadUserData = async () => {
            try {
                const data = await userManager.getUserData(user.uid);
                if (data) {
                    setUserData(data);
                    setDisplayName(data.displayName || '');
                    setSettings(data.settings || settings);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [user]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const updateProfile = async () => {
        try {
            await userManager.updateUserProfile(user.uid, {
                displayName: displayName.trim()
            });
            showNotification('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Error updating profile', 'error');
        }
    };

    const updateSettings = async () => {
        try {
            await userManager.updateSettings(user.uid, settings);
            showNotification('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            showNotification('Error updating settings', 'error');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.prompt(
            'Are you sure you want to delete your account? This will delete all your tasks and data.\n\nType "DELETE" to confirm:'
        );

        if (confirmation !== 'DELETE') return;

        try {
            // Delete user's tasks
            const tasksSnapshot = await db.collection('tasks')
                .where('userId', '==', user.uid)
                .get();
            const tasksBatch = db.batch();
            tasksSnapshot.docs.forEach(doc => tasksBatch.delete(doc.ref));
            await tasksBatch.commit();

            // Delete user's categories
            const categoriesSnapshot = await db.collection('categories')
                .where('userId', '==', user.uid)
                .get();
            const categoriesBatch = db.batch();
            categoriesSnapshot.docs.forEach(doc => categoriesBatch.delete(doc.ref));
            await categoriesBatch.commit();

            // Delete user document
            await db.collection('users').doc(user.uid).delete();

            // Delete auth account
            await user.delete();

            showNotification('Account deleted successfully');
            // User will be logged out automatically
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification('Error deleting account: ' + error.message, 'error');
        }
    };

    if (loading) {
        return <div className="loading">Loading settings...</div>;
    }

    return (
        <div className="page-container">
            {notification && (
                <window.Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="page-header">
                <button className="btn-back" onClick={onBack}>← Back</button>
                <h2>⚙️ Settings</h2>
            </div>

            <div className="page-content settings-page">
                {/* Profile Section */}
                <div className="settings-section">
                    <h3>👤 Profile Information</h3>
                    <div className="settings-card">
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="input-disabled"
                            />
                        </div>

                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <button className="btn-primary" onClick={updateProfile}>
                            Update Profile
                        </button>
                    </div>
                </div>

                {/* Account Info Section */}
                {userData && (
                    <div className="settings-section">
                        <h3>📊 Account Information</h3>
                        <div className="settings-card">
                            <div className="info-row">
                                <span className="info-label">Member Since:</span>
                                <span className="info-value">
                                    {userData.createdAt ? 
                                        new Date(userData.createdAt.seconds * 1000).toLocaleDateString() : 
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Last Login:</span>
                                <span className="info-value">
                                    {userData.lastLogin ? 
                                        new Date(userData.lastLogin.seconds * 1000).toLocaleString() : 
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">User ID:</span>
                                <span className="info-value" style={{fontSize: '12px'}}>
                                    {user.uid}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preferences Section */}
                <div className="settings-section">
                    <h3>🎨 Preferences</h3>
                    <div className="settings-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <strong>Theme</strong>
                                <p>Choose your preferred color theme</p>
                            </div>
                            <select
                                value={settings.theme}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    theme: e.target.value
                                })}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark (Coming Soon)</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <strong>Notifications</strong>
                                <p>Enable browser notifications for task reminders</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        notifications: e.target.checked
                                    })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <strong>Email Updates</strong>
                                <p>Receive email updates about your tasks</p>
                            </div>
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={settings.emailUpdates}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        emailUpdates: e.target.checked
                                    })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <button className="btn-primary" onClick={updateSettings}>
                            Save Preferences
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="settings-section danger-zone">
                    <h3>⚠️ Danger Zone</h3>
                    <div className="settings-card">
                        <div className="setting-item">
                            <div className="setting-info">
                                <strong>Delete Account</strong>
                                <p>Permanently delete your account and all data</p>
                            </div>
                            <button className="btn-danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

window.SettingsPage = SettingsPage;
