import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) { return null }

        try {
            return JSON.parse(storedUser);
        } catch {
            sessionStorage.removeItem("user");
            return null;
        }
    });

    const [requestInitialized, setRequestInitialized] = useState(false);

    useEffect(() => {
        const resolveRequest = async () => {
            Swal.fire({
                title: "Loading...",
                text: "Initializing application",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            try {
                const params = new URLSearchParams(window.location.search);
                const encryptedRequest = params.get("@") || params.get("request") || "";

                const response =
                    await axios.get(`${BASE_URL}/api/Dashboard/decrypt-request`,
                        { params: { request: encryptedRequest } }
                    );

                const resolved = response.data?.data?.data;

                const resolvedUser = {
                    ulbId: Number(resolved?.ulbId),
                    corpCode: resolved?.corpCode || "",
                    decryptedRequest: resolved?.decryptedRequest || "",
                    resolvedEncryptedRequest: resolved?.resolvedEncryptedRequest || encryptedRequest,
                };

                setUser(resolvedUser);

                sessionStorage.setItem("user", JSON.stringify(resolvedUser));
            } catch (error) {
                console.error("Request resolution error:", error);
                const storedUser = sessionStorage.getItem("user");
                if (!storedUser) { setUser(null) }
            } finally {
                if (Swal.isVisible()) {
                Swal.close();
            }
                setRequestInitialized(true);
            }
        };
        resolveRequest();
    }, []);

    const login = (userData) => {
        const authenticatedUser = { ...userData, ulbId: Number(userData?.ulbId || user?.ulbId) };
        setUser(authenticatedUser);
        sessionStorage.setItem("user", JSON.stringify(authenticatedUser));
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("user");
    };

    useEffect(() => {
        if (!user) { return }
        sessionStorage.setItem("user", JSON.stringify(user)
        );
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, requestInitialized }}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);

export default AuthProvider;