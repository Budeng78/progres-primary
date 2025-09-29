// resources/js/aplikasi/auth/hooks/useAuth.jsx
import { useContext } from 'react';
import AuthContext from '../auth/AuthContext';

const useAuth = () => useContext(AuthContext);

export default useAuth;