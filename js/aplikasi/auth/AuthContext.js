// resources/js/aplikasi/auth/AuthContext.js

import { createContext } from 'react';

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => {},
    logout: () => {},
    resetAuthTimer: () => {},
    showWelcomeModal: false,
    setShowWelcomeModal: () => {},
});

export default AuthContext;
