// resources/js/aplikasi/layouts/menuFilter.js
export const filterMenuByPermission = (menuItems, userPermissions) => {
    return menuItems
        .map(item => {
            // cek permission parent
            if (item.permission && !userPermissions.includes(item.permission)) {
                return null;
            }

            // jika ada children, filter rekursif
            if (item.children) {
                const filteredChildren = filterMenuByPermission(item.children, userPermissions);
                if (filteredChildren.length === 0 && !item.path) return null;
                return { ...item, children: filteredChildren };
            }

            return item;
        })
        .filter(Boolean);
};
