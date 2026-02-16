// Notification Component
const Notification = ({ message, type, onClose }) => {
    const { useEffect } = React;

    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <span>{message}</span>
        </div>
    );
};

window.Notification = Notification;
