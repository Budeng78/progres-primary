// resources/js/aplikasi/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredPermission, requiredRole }) => {
    const { user } = useAuth();

    if (!user?.token) return <Navigate to="/login" />;

    if (requiredPermission && !user.permissions.includes(requiredPermission)) {
        return <Navigate to="/unauthorized" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
