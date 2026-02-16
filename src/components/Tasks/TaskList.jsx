// Task List Component
const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete }) => {
    const TaskItem = window.TaskItem;

    return (
        <ul className="task-list">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

window.TaskList = TaskList;
