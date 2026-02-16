// Stats Cards Component
const StatsCards = ({ stats }) => {
    return (
        <div className="stats">
            <div className="stat-card">
                <h4>Total Tasks</h4>
                <div className="number">{stats.total}</div>
            </div>
            <div className="stat-card">
                <h4>Completed</h4>
                <div className="number">{stats.completed}</div>
            </div>
            <div className="stat-card">
                <h4>Pending</h4>
                <div className="number">{stats.pending}</div>
            </div>
        </div>
    );
};

window.StatsCards = StatsCards;
