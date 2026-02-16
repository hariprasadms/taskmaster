// Main App Component
const App = () => {
    const { useState, useEffect } = React;
    const auth = window.auth;
    const db = window.db;
    const helpers = window.helpers;
    
    // Import components
    const Notification = window.Notification;
    const AuthScreen = window.AuthScreen;
    const AppHeader = window.AppHeader;
    const Sidebar = window.Sidebar;
    const StatsCards = window.StatsCards;
    const TaskForm = window.TaskForm;
    const TaskControls = window.TaskControls;
    const TaskList = window.TaskList;
    const EmptyState = window.EmptyState;
    const EditTaskModal = window.EditTaskModal;
    const LabelsPage = window.LabelsPage;
    const CategoriesPage = window.CategoriesPage;
    const SettingsPage = window.SettingsPage;

    // State
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState('tasks');
    const [categories, setCategories] = useState([
        { id: 'all', name: 'All Tasks', count: 0 },
        { id: 'today', name: 'Today', count: 0 },
        { id: 'upcoming', name: 'Upcoming', count: 0 },
        { id: 'completed', name: 'Completed', count: 0 }
    ]);
    const [customCategories, setCustomCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('created');
    const [filterPriority, setFilterPriority] = useState('all');
    const [notification, setNotification] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        dueDate: '',
        labels: []
    });
    const [editingTask, setEditingTask] = useState(null);

    // Auth listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // Real-time tasks listener
    useEffect(() => {
        if (!user) return;

        const unsubscribe = db.collection('tasks')
            .where('userId', '==', user.uid)
            .onSnapshot((snapshot) => {
                const tasksData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Sort in memory
                tasksData.sort((a, b) => {
                    const aTime = a.createdAt?.seconds || 0;
                    const bTime = b.createdAt?.seconds || 0;
                    return bTime - aTime;
                });
                
                console.log('Tasks loaded:', tasksData.length, 'tasks');
                setTasks(tasksData);
                updateCategoryCounts(tasksData);
            }, (error) => {
                console.error('Error loading tasks:', error);
                showNotification('Error loading tasks: ' + error.message, 'error');
            });

        return unsubscribe;
    }, [user]);

    // Load custom categories
    useEffect(() => {
        if (!user) return;

        const unsubscribe = db.collection('categories')
            .where('userId', '==', user.uid)
            .onSnapshot((snapshot) => {
                const cats = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCustomCategories(cats);
            });

        return unsubscribe;
    }, [user]);

    // Helper functions
    const updateCategoryCounts = (tasksData) => {
        setCategories(helpers.updateCategoryCounts(tasksData, categories));
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    // Task operations
    const addTask = async () => {
        if (!newTask.title.trim()) {
            showNotification('Please enter a task title', 'error');
            return;
        }

        try {
            console.log('Adding task:', newTask);
            const docRef = await db.collection('tasks').add({
                title: newTask.title,
                description: newTask.description,
                category: newTask.category,
                priority: newTask.priority,
                dueDate: newTask.dueDate,
                labels: newTask.labels,
                userId: user.uid,
                completed: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Task added with ID:', docRef.id);

            setNewTask({
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                dueDate: '',
                labels: []
            });

            showNotification('Task added successfully!');
        } catch (error) {
            console.error('Error adding task:', error);
            showNotification('Error adding task: ' + error.message, 'error');
        }
    };

    const updateTask = async (taskId, updates) => {
        try {
            console.log('Updating task:', taskId, updates);
            await db.collection('tasks').doc(taskId).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showNotification('Task updated!');
        } catch (error) {
            console.error('Error updating task:', error);
            showNotification('Error updating task: ' + error.message, 'error');
        }
    };

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                console.log('Deleting task:', taskId);
                await db.collection('tasks').doc(taskId).delete();
                showNotification('Task deleted!');
            } catch (error) {
                console.error('Error deleting task:', error);
                showNotification('Error deleting task: ' + error.message, 'error');
            }
        }
    };

    const toggleComplete = async (task) => {
        await updateTask(task.id, { completed: !task.completed });
    };

    const addCategory = async () => {
        const name = prompt('Enter category name:');
        if (name && name.trim()) {
            try {
                await db.collection('categories').add({
                    name: name.trim(),
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                showNotification('Category added!');
            } catch (error) {
                showNotification('Error adding category', 'error');
            }
        }
    };

    // Filter and sort tasks
    const getFilteredTasks = () => {
        let filtered = helpers.filterByCategory(tasks, selectedCategory);
        filtered = helpers.filterBySearch(filtered, searchQuery);
        filtered = helpers.filterByPriority(filtered, filterPriority);

        // Sort
        if (sortBy === 'created') {
            filtered = helpers.sortByTimestamp(filtered, 'createdAt', 'desc');
        } else if (sortBy === 'dueDate') {
            filtered = helpers.sortByDate(filtered, 'dueDate', 'asc');
        } else if (sortBy === 'priority') {
            filtered = helpers.sortByPriority(filtered, 'desc');
        }

        return filtered;
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            showNotification('Error signing out', 'error');
        }
    };

    // Render
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <AuthScreen onAuthSuccess={() => setUser(auth.currentUser)} />;
    }

    const filteredTasks = getFilteredTasks();
    const stats = helpers.getStats(tasks);

    // Render pages based on current page
    const renderPage = () => {
        switch (currentPage) {
            case 'categories':
                return <window.CategoriesPage user={user} onBack={() => setCurrentPage('tasks')} />;
            case 'labels':
                return <window.LabelsPage user={user} onBack={() => setCurrentPage('tasks')} />;
            case 'settings':
                return <window.SettingsPage user={user} onBack={() => setCurrentPage('tasks')} />;
            case 'tasks':
            default:
                return (
                    <>
                        <Sidebar
                            categories={categories}
                            customCategories={customCategories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            onAddCategory={addCategory}
                            tasks={tasks}
                        />

                        <div className="task-section">
                            <StatsCards stats={stats} />

                            <TaskForm
                                newTask={newTask}
                                setNewTask={setNewTask}
                                onAddTask={addTask}
                                customCategories={customCategories}
                            />

                            <TaskControls
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                filterPriority={filterPriority}
                                setFilterPriority={setFilterPriority}
                            />

                            {filteredTasks.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <TaskList
                                    tasks={filteredTasks}
                                    onToggleComplete={toggleComplete}
                                    onEdit={setEditingTask}
                                    onDelete={deleteTask}
                                />
                            )}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="container">
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <AppHeader 
                user={user} 
                onLogout={handleLogout}
                currentPage={currentPage}
                onNavigate={setCurrentPage}
            />

            <div className={currentPage === 'tasks' ? 'main-content' : ''}>
                {renderPage()}
            </div>

            {editingTask && (
                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={(updates) => {
                        updateTask(editingTask.id, updates);
                        setEditingTask(null);
                    }}
                    categories={customCategories}
                />
            )}
        </div>
    );
};

// Render App
ReactDOM.render(<App />, document.getElementById('root'));
