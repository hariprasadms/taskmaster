// Edit Task Modal Component
const EditTaskModal = ({ task, onClose, onSave, categories }) => {
    const { useState } = React;
    const [formData, setFormData] = useState({
        title: task.title,
        description: task.description || '',
        category: task.category || '',
        priority: task.priority,
        dueDate: task.dueDate || '',
        labels: task.labels || []
    });
    const [labelInput, setLabelInput] = useState('');

    const addLabel = () => {
        if (labelInput.trim() && !formData.labels.includes(labelInput.trim())) {
            setFormData({
                ...formData,
                labels: [...formData.labels, labelInput.trim()]
            });
            setLabelInput('');
        }
    };

    const removeLabel = (label) => {
        setFormData({
            ...formData,
            labels: formData.labels.filter(l => l !== label)
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Task</h3>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="task-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Due Date</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Labels</label>
                    <div className="label-input">
                        <input
                            type="text"
                            placeholder="Add label"
                            value={labelInput}
                            onChange={(e) => setLabelInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                        />
                        <button className="btn-secondary btn-small" onClick={addLabel}>
                            Add
                        </button>
                    </div>
                    {formData.labels.length > 0 && (
                        <div className="added-labels">
                            {formData.labels.map(label => (
                                <span key={label} className="added-label">
                                    {label}
                                    <span className="remove-label" onClick={() => removeLabel(label)}>×</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn" onClick={() => onSave(formData)}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

window.EditTaskModal = EditTaskModal;
