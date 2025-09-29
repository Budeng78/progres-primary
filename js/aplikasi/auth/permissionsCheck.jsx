// resources/js/aplikasi/auth/permissionsCheck.jsx
export const hasPermission = (user, requiredPermission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission);
};

export const hasRole = (user, requiredRole) => {
    return user?.role === requiredRole;
};