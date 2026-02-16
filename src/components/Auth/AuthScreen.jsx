// Auth Screen Component
const AuthScreen = ({ onAuthSuccess }) => {
    const { useState } = React;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await window.auth.signInWithEmailAndPassword(email, password);
            } else {
                await window.auth.createUserWithEmailAndPassword(email, password);
            }
            onAuthSuccess();
        } catch (err) {
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
