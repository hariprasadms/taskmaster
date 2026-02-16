// App Header Component
const AppHeader = ({ user, onLogout, currentPage, onNavigate }) => {
    return (
        <div className="app-header">
            <h1>📝 TaskMaster</h1>
            <div className="nav-menu">
                <button 
                    className={`nav-link ${currentPage === 'tasks' ? 'active' : ''}`}
                    onClick={() => onNavigate('tasks')}
                >
                    Tasks
                </button>
                <button 
                    className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`}
                    onClick={() => onNavigate('categories')}
                >
                    Categories
                </button>
                <button 
                    className={`nav-link ${currentPage === 'labels' ? 'active' : ''}`}
                    onClick={() => onNavigate('labels')}
                >
                    Labels
                </button>
                <button 
                    className={`nav-link ${currentPage === 'settings' ? 'active' : ''}`}
                    onClick={() => onNavigate('settings')}
                >
                    Settings
                </button>
            </div>
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
