// Sidebar Component
const Sidebar = ({ 
    categories, 
    customCategories, 
    selectedCategory, 
    onSelectCategory, 
    onAddCategory,
    tasks 
}) => {
    return (
        <div className="sidebar">
            <h3>Categories</h3>
            <ul className="category-list">
                {categories.map(cat => (
                    <li
                        key={cat.id}
                        className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.id)}
                    >
                        <span>{cat.name}</span>
                        <span className="category-badge">{cat.count}</span>
                    </li>
                ))}
                {customCategories.map(cat => (
                    <li
                        key={cat.id}
                        className={`category-item ${selectedCategory === cat.name ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat.name)}
                    >
                        <span>{cat.name}</span>
                        <span className="category-badge">
                            {tasks.filter(t => t.category === cat.name).length}
                        </span>
                    </li>
                ))}
            </ul>
            <button className="add-category-btn" onClick={onAddCategory}>
                + Add Category
            </button>
        </div>
    );
};

window.Sidebar = Sidebar;
