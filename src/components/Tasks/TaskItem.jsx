// Task Item Component
const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
    const helpers = window.helpers;

    return (
        <li className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-header">
                <input
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task)}
                />
                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                </span>
                <div className="task-labels">
                    <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                    </span>
                    {task.labels?.map(label => (
                        <span key={label} className="label-tag">{label}</span>
                    ))}
                </div>
                <div className="task-actions">
                    <button
                        className="btn-icon btn-edit"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn-icon btn-delete"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="task-body">
                {task.description && (
                    <p className="task-description-text">{task.description}</p>
                )}
                <div className="task-meta">
                    {task.category && <span>📁 {task.category}</span>}
                    {task.dueDate && <span>📅 Due: {task.dueDate}</span>}
                    {task.createdAt && (
                        <span>🕐 Created: {helpers.formatDate(task.createdAt)}</span>
                    )}
                </div>
            </div>
        </li>
    );
};

window.TaskItem = TaskItem;
