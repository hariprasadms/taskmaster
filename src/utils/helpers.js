// Helper Utilities

const helpers = {
    // Format date for display
    formatDate: (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.seconds 
            ? new Date(timestamp.seconds * 1000) 
            : new Date(timestamp);
        return date.toLocaleDateString();
    },

    // Check if date is today
    isToday: (dateString) => {
        if (!dateString) return false;
        const today = new Date().toISOString().split('T')[0];
        return dateString === today;
    },

    // Check if date is in the future
    isFuture: (dateString) => {
        if (!dateString) return false;
        const today = new Date().toISOString().split('T')[0];
        return dateString > today;
    },

    // Sort tasks by timestamp
    sortByTimestamp: (tasks, field = 'createdAt', order = 'desc') => {
        return [...tasks].sort((a, b) => {
            const aTime = a[field]?.seconds || 0;
            const bTime = b[field]?.seconds || 0;
            return order === 'desc' ? bTime - aTime : aTime - bTime;
        });
    },

    // Sort tasks by date string
    sortByDate: (tasks, field = 'dueDate', order = 'asc') => {
        return [...tasks].sort((a, b) => {
            if (!a[field]) return 1;
            if (!b[field]) return -1;
            return order === 'asc' 
                ? a[field].localeCompare(b[field])
                : b[field].localeCompare(a[field]);
        });
    },

    // Sort tasks by priority
    sortByPriority: (tasks, order = 'desc') => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return [...tasks].sort((a, b) => {
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;
            return order === 'desc' ? bPriority - aPriority : aPriority - bPriority;
        });
    },

    // Filter tasks by search query
    filterBySearch: (tasks, query) => {
        if (!query) return tasks;
        const lowerQuery = query.toLowerCase();
        return tasks.filter(task => 
            task.title.toLowerCase().includes(lowerQuery) ||
            (task.description && task.description.toLowerCase().includes(lowerQuery)) ||
            (task.labels && task.labels.some(l => l.toLowerCase().includes(lowerQuery)))
        );
    },

    // Filter tasks by category
    filterByCategory: (tasks, category) => {
        if (category === 'all') return tasks;
        if (category === 'today') {
            return tasks.filter(t => helpers.isToday(t.dueDate) && !t.completed);
        }
        if (category === 'upcoming') {
            return tasks.filter(t => helpers.isFuture(t.dueDate) && !t.completed);
        }
        if (category === 'completed') {
            return tasks.filter(t => t.completed);
        }
        return tasks.filter(t => t.category === category);
    },

    // Filter tasks by priority
    filterByPriority: (tasks, priority) => {
        if (priority === 'all') return tasks;
        return tasks.filter(t => t.priority === priority);
    },

    // Get task statistics
    getStats: (tasks) => {
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length
        };
    },

    // Update category counts
    updateCategoryCounts: (tasks, categories) => {
        return categories.map(cat => {
            let count = 0;
            if (cat.id === 'all') {
                count = tasks.length;
            } else if (cat.id === 'today') {
                count = tasks.filter(t => helpers.isToday(t.dueDate) && !t.completed).length;
            } else if (cat.id === 'upcoming') {
                count = tasks.filter(t => helpers.isFuture(t.dueDate) && !t.completed).length;
            } else if (cat.id === 'completed') {
                count = tasks.filter(t => t.completed).length;
            }
            return { ...cat, count };
        });
    }
};

window.helpers = helpers;
