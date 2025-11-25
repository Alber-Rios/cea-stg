import { createContext, useState, useEffect } from 'react';
import { account, databases, DATABASE_ID } from '../config/appwriteConfig';
import { ID, Query } from 'appwrite';

export const AuthContext = createContext();

const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserSession();
    }, []);

    const getUserRole = async (userId) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                USERS_COLLECTION_ID,
                [Query.equal('userId', userId)]
            );

            if (response.documents.length > 0) {
                return response.documents[0].rol || 'user';
            }
            return 'user';
        } catch (error) {
            console.error('Error obteniendo rol');
            return 'user';
        }
    };

    const checkUserSession = async () => {
        try {
            const session = await account.get();
            setUser(session);
            const role = await getUserRole(session.$id);

            if (role === 'user') {
                try {
                    const response = await databases.listDocuments(
                        DATABASE_ID,
                        USERS_COLLECTION_ID,
                        [Query.equal('userId', session.$id)]
                    );

                    if (response.documents.length === 0) {
                        await databases.createDocument(
                            DATABASE_ID,
                            USERS_COLLECTION_ID,
                            ID.unique(),
                            {
                                userId: session.$id,
                                correo: session.email,
                                name: session.name,
                                rol: 'user'
                            }
                        );
                    }
                } catch (dbError) {
                    console.error('Error creando documento de usuario');
                }
            }

            setUserRole(role);
        } catch (error) {
            setUser(null);
            setUserRole(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, name) => {
        try {
            const newUser = await account.create(ID.unique(), email, password, name);
            await account.createEmailPasswordSession(email, password);

            try {
                await databases.createDocument(
                    DATABASE_ID,
                    USERS_COLLECTION_ID,
                    ID.unique(),
                    {
                        userId: newUser.$id,
                        correo: email,
                        name: name,
                        rol: 'user'
                    }
                );
            } catch (dbError) {
                console.error('Error creando documento');
            }

            const userData = await account.get();
            setUser(userData);
            setUserRole('user');

            return { success: true, role: 'user' };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al registrar usuario'
            };
        }
    };

    const login = async (email, password) => {
        try {
            await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            const role = await getUserRole(userData.$id);

            setUser(userData);
            setUserRole(role);

            return { success: true, role };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión'
            };
        }
    };

    const loginWithGoogle = async () => {
        try {
            account.createOAuth2Session(
                'google',
                `${window.location.origin}/`,
                `${window.location.origin}/login`
            );
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al iniciar sesión con Google'
            };
        }
    };

    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            setUserRole(null);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error al cerrar sesión'
            };
        }
    };

    const value = {
        user,
        userRole,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        checkUserSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
