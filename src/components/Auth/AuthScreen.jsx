// Auth Screen Component
const AuthScreen = ({ onAuthSuccess }) => {
    const { useState } = React;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let userCredential;
            
            if (isLogin) {
                // Login
                userCredential = await window.auth.signInWithEmailAndPassword(email, password);
                
                // Update last login
                await window.userManager.updateLastLogin(userCredential.user.uid);
                console.log('✅ User logged in and last login updated');
            } else {
                // Sign up
                userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
                
                // Create user document
                await window.userManager.createUserDocument(
                    userCredential.user,
                    displayName.trim()
                );
                console.log('✅ User account created and document created in Firestore');
            }
            
            onAuthSuccess();
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login to TaskMaster' : 'Create Account'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                )}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        minLength="6"
                    />
                </div>
                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
            </form>
            <div className="text-center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="link" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>
            </div>
        </div>
    );
};

window.AuthScreen = AuthScreen;
