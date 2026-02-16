// Task Form Component
const TaskForm = ({ 
    newTask, 
    setNewTask, 
    onAddTask, 
    customCategories 
}) => {
    const { useState } = React;
    const [labelInput, setLabelInput] = useState('');

    const addLabel = () => {
        if (labelInput.trim() && !newTask.labels.includes(labelInput.trim())) {
            setNewTask({
                ...newTask,
                labels: [...newTask.labels, labelInput.trim()]
            });
            setLabelInput('');
        }
    };

    const removeLabel = (label) => {
        setNewTask({
            ...newTask,
            labels: newTask.labels.filter(l => l !== label)
        });
    };

    return (
        <div className="add-task-form">
            <div className="task-input-group">
                <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {customCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                </select>
                <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
            </div>
            <textarea
                className="task-description"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="label-input">
                <input
                    type="text"
                    placeholder="Add label"
                    value={labelInput}
                    onChange={(e) => setLabelInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                />
                <button className="btn-secondary btn-small" onClick={addLabel}>
                    Add Label
                </button>
            </div>
            {newTask.labels.length > 0 && (
                <div className="added-labels">
                    {newTask.labels.map(label => (
                        <span key={label} className="added-label">
                            {label}
                            <span className="remove-label" onClick={() => removeLabel(label)}>×</span>
                        </span>
                    ))}
                </div>
            )}
            <button className="btn-add" onClick={onAddTask} style={{ marginTop: '12px' }}>
                ➕ Add Task
            </button>
        </div>
    );
};

window.TaskForm = TaskForm;
