// Labels Management Page Component
const LabelsPage = ({ user, onBack }) => {
    const { useState, useEffect } = React;
    const db = window.db;
    const [labels, setLabels] = useState([]);
    const [newLabel, setNewLabel] = useState('');
    const [editingLabel, setEditingLabel] = useState(null);
    const [notification, setNotification] = useState(null);

    // Load all unique labels from tasks
    useEffect(() => {
        if (!user) return;

        const unsubscribe = db.collection('tasks')
            .where('userId', '==', user.uid)
            .onSnapshot((snapshot) => {
                const allLabels = new Set();
                snapshot.docs.forEach(doc => {
                    const task = doc.data();
                    if (task.labels && Array.isArray(task.labels)) {
                        task.labels.forEach(label => allLabels.add(label));
                    }
                });
                
                const labelsList = Array.from(allLabels).map(label => ({
                    name: label,
                    count: snapshot.docs.filter(doc => 
                        doc.data().labels && doc.data().labels.includes(label)
                    ).length
                }));

                setLabels(labelsList.sort((a, b) => b.count - a.count));
            });

        return unsubscribe;
    }, [user]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const renameLabel = async () => {
        if (!editingLabel || !editingLabel.newName.trim()) return;

        try {
            const tasksSnapshot = await db.collection('tasks')
                .where('userId', '==', user.uid)
                .get();

            const batch = db.batch();
            tasksSnapshot.docs.forEach(doc => {
                const task = doc.data();
                if (task.labels && task.labels.includes(editingLabel.oldName)) {
                    const updatedLabels = task.labels.map(l => 
                        l === editingLabel.oldName ? editingLabel.newName : l
                    );
                    batch.update(doc.ref, { labels: updatedLabels });
                }
            });

            await batch.commit();
            showNotification('Label renamed successfully!');
            setEditingLabel(null);
        } catch (error) {
            console.error('Error renaming label:', error);
            showNotification('Error renaming label', 'error');
        }
    };

    const deleteLabel = async (labelName) => {
        if (!window.confirm(`Delete label "${labelName}" from all tasks?`)) return;

        try {
            const tasksSnapshot = await db.collection('tasks')
                .where('userId', '==', user.uid)
                .get();

            const batch = db.batch();
            tasksSnapshot.docs.forEach(doc => {
                const task = doc.data();
                if (task.labels && task.labels.includes(labelName)) {
                    const updatedLabels = task.labels.filter(l => l !== labelName);
                    batch.update(doc.ref, { labels: updatedLabels });
                }
            });

            await batch.commit();
            showNotification('Label deleted successfully!');
        } catch (error) {
            console.error('Error deleting label:', error);
            showNotification('Error deleting label', 'error');
        }
    };

    return (
        <div className="page-container">
            {notification && (
                <window.Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="page-header">
                <button className="btn-back" onClick={onBack}>← Back</button>
                <h2>🏷️ Manage Labels</h2>
            </div>

            <div className="page-content">
                <div className="info-card">
                    <p>Labels help you organize tasks across categories. Manage all your labels here.</p>
                </div>

                {labels.length === 0 ? (
                    <div className="empty-state">
                        <h3>No labels yet</h3>
                        <p>Labels will appear here once you add them to tasks</p>
                    </div>
                ) : (
                    <div className="labels-list">
                        {labels.map(label => (
                            <div key={label.name} className="label-item">
                                {editingLabel && editingLabel.oldName === label.name ? (
                                    <div className="label-edit">
                                        <input
                                            type="text"
                                            value={editingLabel.newName}
                                            onChange={(e) => setEditingLabel({
                                                ...editingLabel,
                                                newName: e.target.value
                                            })}
                                            placeholder="New label name"
                                        />
                                        <button 
                                            className="btn-small btn-primary" 
                                            onClick={renameLabel}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="btn-small btn-secondary" 
                                            onClick={() => setEditingLabel(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="label-info">
                                            <span className="label-name">{label.name}</span>
                                            <span className="label-count">{label.count} task{label.count !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="label-actions">
                                            <button 
                                                className="btn-icon btn-edit"
                                                onClick={() => setEditingLabel({ 
                                                    oldName: label.name, 
                                                    newName: label.name 
                                                })}
                                            >
                                                Rename
                                            </button>
                                            <button 
                                                className="btn-icon btn-delete"
                                                onClick={() => deleteLabel(label.name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

window.LabelsPage = LabelsPage;
