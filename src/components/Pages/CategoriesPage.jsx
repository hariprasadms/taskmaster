// Categories Management Page Component
const CategoriesPage = ({ user, onBack }) => {
    const { useState, useEffect } = React;
    const db = window.db;
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [notification, setNotification] = useState(null);

    // Load categories
    useEffect(() => {
        if (!user) return;

        const unsubscribe = db.collection('categories')
            .where('userId', '==', user.uid)
            .onSnapshot(async (snapshot) => {
                const cats = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Get task counts for each category
                const tasksSnapshot = await db.collection('tasks')
                    .where('userId', '==', user.uid)
                    .get();

                const catsWithCounts = cats.map(cat => ({
                    ...cat,
                    count: tasksSnapshot.docs.filter(doc => 
                        doc.data().category === cat.name
                    ).length
                }));

                setCategories(catsWithCounts.sort((a, b) => 
                    (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                ));
            });

        return unsubscribe;
    }, [user]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const addCategory = async () => {
        if (!newCategory.trim()) {
            showNotification('Please enter a category name', 'error');
            return;
        }

        // Check if category already exists
        if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
            showNotification('Category already exists', 'error');
            return;
        }

        try {
            await db.collection('categories').add({
                name: newCategory.trim(),
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            setNewCategory('');
            showNotification('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
            showNotification('Error adding category', 'error');
        }
    };

    const updateCategory = async () => {
        if (!editingCategory || !editingCategory.name.trim()) return;

        try {
            await db.collection('categories').doc(editingCategory.id).update({
                name: editingCategory.name.trim(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update tasks with old category name
            const tasksSnapshot = await db.collection('tasks')
                .where('userId', '==', user.uid)
                .where('category', '==', editingCategory.oldName)
                .get();

            const batch = db.batch();
            tasksSnapshot.docs.forEach(doc => {
                batch.update(doc.ref, { category: editingCategory.name.trim() });
            });
            await batch.commit();

            showNotification('Category updated successfully!');
            setEditingCategory(null);
        } catch (error) {
            console.error('Error updating category:', error);
            showNotification('Error updating category', 'error');
        }
    };

    const deleteCategory = async (category) => {
        const tasksInCategory = category.count;
        
        let confirmMessage = `Delete category "${category.name}"?`;
        if (tasksInCategory > 0) {
            confirmMessage += `\n\nThis will remove the category from ${tasksInCategory} task${tasksInCategory !== 1 ? 's' : ''}.`;
        }

        if (!window.confirm(confirmMessage)) return;

        try {
            // Delete category
            await db.collection('categories').doc(category.id).delete();

            // Remove category from tasks
            if (tasksInCategory > 0) {
                const tasksSnapshot = await db.collection('tasks')
                    .where('userId', '==', user.uid)
                    .where('category', '==', category.name)
                    .get();

                const batch = db.batch();
                tasksSnapshot.docs.forEach(doc => {
                    batch.update(doc.ref, { category: '' });
                });
                await batch.commit();
            }

            showNotification('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('Error deleting category', 'error');
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
                <h2>📁 Manage Categories</h2>
            </div>

            <div className="page-content">
                <div className="add-item-form">
                    <input
                        type="text"
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <button className="btn-primary" onClick={addCategory}>
                        Add Category
                    </button>
                </div>

                {categories.length === 0 ? (
                    <div className="empty-state">
                        <h3>No categories yet</h3>
                        <p>Create your first category above</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map(category => (
                            <div key={category.id} className="category-card">
                                {editingCategory && editingCategory.id === category.id ? (
                                    <div className="category-edit">
                                        <input
                                            type="text"
                                            value={editingCategory.name}
                                            onChange={(e) => setEditingCategory({
                                                ...editingCategory,
                                                name: e.target.value
                                            })}
                                            placeholder="Category name"
                                        />
                                        <div className="edit-actions">
                                            <button 
                                                className="btn-small btn-primary" 
                                                onClick={updateCategory}
                                            >
                                                Save
                                            </button>
                                            <button 
                                                className="btn-small btn-secondary" 
                                                onClick={() => setEditingCategory(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="category-info">
                                            <h3>{category.name}</h3>
                                            <p className="category-count">
                                                {category.count} task{category.count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="category-actions">
                                            <button 
                                                className="btn-icon btn-edit"
                                                onClick={() => setEditingCategory({ 
                                                    id: category.id,
                                                    name: category.name,
                                                    oldName: category.name
                                                })}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-icon btn-delete"
                                                onClick={() => deleteCategory(category)}
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

window.CategoriesPage = CategoriesPage;
