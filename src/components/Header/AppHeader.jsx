// App Header Component
const AppHeader = ({ user, onLogout }) => {
    return (
        <div className="app-header">
            <h1>📝 TaskMaster</h1>
            <div className="user-info">
                <span className="user-email">{user.email}</span>
                <button className="btn-secondary" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

window.AppHeader = AppHeader;
