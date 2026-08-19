import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) return null;

        try {
            return JSON.parse(storedUser);
        } catch {
            sessionStorage.removeItem("user");
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return sessionStorage.getItem("accessToken") || null;
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

                const response = await axios.get(
                    `${BASE_URL}/api/Dashboard/decrypt-request`,
                    {params: {request: encryptedRequest}}
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

                if (!storedUser) {
                    setUser(null);
                }
            } finally {
                if (Swal.isVisible()) {
                    Swal.close();
                }

                setRequestInitialized(true);
            }
        };

        resolveRequest();
    }, []);

    const login = (userData, accessToken) => {
        const authenticatedUser = {...userData, ulbId: Number(userData?.ulbId || user?.ulbId)};

        setUser(authenticatedUser);
        setToken(accessToken || null);

        sessionStorage.setItem("user",JSON.stringify(authenticatedUser));
        if (accessToken) {
            sessionStorage.setItem("accessToken", accessToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("ulbId");
        sessionStorage.removeItem("corpId");
        sessionStorage.removeItem("citizen");
    };

    useEffect(() => {
        if (!user) return;

        sessionStorage.setItem("user",JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        if (!token) return;
        sessionStorage.setItem("accessToken", token);
    }, [token]);

    return (
        <AuthContext.Provider value={{user, token, setUser, setToken, login, logout, requestInitialized}}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;