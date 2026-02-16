// Task Controls Component
const TaskControls = ({ 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    filterPriority, 
    setFilterPriority 
}) => {
    return (
        <div className="controls">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="🔍 Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="filter-sort">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="created">Sort by: Created Date</option>
                    <option value="dueDate">Sort by: Due Date</option>
                    <option value="priority">Sort by: Priority</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>
            </div>
        </div>
    );
};

window.TaskControls = TaskControls;
