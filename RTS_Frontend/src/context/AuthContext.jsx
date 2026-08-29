import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_ULB_ID = import.meta.env.VITE_DEFAULT_ULB_ID;

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
            return {
                ulbId: DEFAULT_ULB_ID,
            }
        };

        try {
            const parsedUser = JSON.parse(storedUser);
            return {
                ...parsedUser,
                ulbId: Number(parsedUser?.ulbId || DEFAULT_ULB_ID),
            }
        } catch {
            sessionStorage.removeItem("user");
            return {
                ulbId: DEFAULT_ULB_ID,
            }
        }
    });

    const [token, setToken] = useState(() => sessionStorage.getItem("accessToken") || null);
    const [requestInitialized, setRequestInitialized] = useState(false);

    const tokenCheckIntervalRef = useRef(null);
    const tokenExpiryTimeoutRef = useRef(null);
    const logoutInProgressRef = useRef(false);

    const clearTokenTimers = () => {
        if (tokenCheckIntervalRef.current) {
            clearInterval(tokenCheckIntervalRef.current);
            tokenCheckIntervalRef.current = null;
        }

        if (tokenExpiryTimeoutRef.current) {
            clearTimeout(tokenExpiryTimeoutRef.current);
            tokenExpiryTimeoutRef.current = null;
        }
    };

    const isTokenExpired = (currentToken) => {
        try {
            if (!currentToken) return true;

            const decoded = jwtDecode(currentToken);

            if (!decoded?.exp) {
                console.warn("JWT does not contain exp");
                return true;
            }

            return decoded.exp * 1000 <= Date.now();
        } catch (error) {
            console.error("Invalid JWT:", error);
            return true;
        }
    };

    const logout = async (reason = "Your login session has expired. Please login again.", showPopup = false) => {
        if (logoutInProgressRef.current) return;
        logoutInProgressRef.current = true;
        console.warn("Logging out user:", reason);

        clearTokenTimers();

        setUser(null);
        setToken(null);

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("ulbId");
        sessionStorage.removeItem("corpId");
        sessionStorage.removeItem("citizen");

        if (showPopup) {
            await Swal.fire({
                icon: "warning",
                text: reason,
                confirmButtonText: "Login Again",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }

        window.location.replace("/");
    };

    const scheduleTokenExpiryLogout = (currentToken) => {
        try {
            if (!currentToken) return;

            const decoded = jwtDecode(currentToken);

            if (!decoded?.exp) {
                logout("Your login session has expired.", true);
                return;
            }

            const expiresAt = decoded.exp * 1000;
            const remainingTime = expiresAt - Date.now();

            if (remainingTime <= 0) {
                logout("Your login session has expired.", true);
                return;
            }

            if (tokenExpiryTimeoutRef.current) {
                clearTimeout(tokenExpiryTimeoutRef.current);
            }

            tokenExpiryTimeoutRef.current = setTimeout(() => {
                const latestToken = sessionStorage.getItem("accessToken");

                if (!latestToken || isTokenExpired(latestToken)) {
                    logout("Your login session has expired.", true);
                } else {
                    scheduleTokenExpiryLogout(latestToken);
                }
            }, remainingTime + 500);

            console.log(`Token expiry logout scheduled in ${Math.round(remainingTime / 1000)} seconds`);
        } catch (error) {
            console.error("Failed to schedule token expiry:", error);
            logout("Your login session has expired.", true);
        }
    };

    const startTokenCheckInterval = () => {
        if (tokenCheckIntervalRef.current) {
            clearInterval(tokenCheckIntervalRef.current);
        }

        tokenCheckIntervalRef.current = setInterval(() => {
            const currentToken = sessionStorage.getItem("accessToken");

            if (!currentToken) {
                logout("Your login session has expired.", true);
                return;
            }

            if (isTokenExpired(currentToken)) {
                logout("Your login session has expired.", true);
                return;
            }

            console.log("Token still valid");
        }, 60 * 1000);
    };

    const startTokenSession = (currentToken) => {
        if (!currentToken) return;

        if (isTokenExpired(currentToken)) {
            logout("Your login session has expired.", true);
            return;
        }

        clearTokenTimers();
        scheduleTokenExpiryLogout(currentToken);
        startTokenCheckInterval();
    };

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
                }
            });

            try {
                const params = new URLSearchParams(window.location.search);
                const encryptedRequest = params.get("@") || params.get("request") || "";

                if (!encryptedRequest) {
                    return;
                }

                const response = await axios.get(`${BASE_URL}/api/Dashboard/decrypt-request`,
                    { params: { request: encryptedRequest } }
                );

                const resolved = response.data?.data?.data;
                const resolvedUser = {
                    ulbId: resolved?.ulbId || DEFAULT_ULB_ID,
                    corpCode: resolved?.corpCode || "",
                    decryptedRequest: resolved?.decryptedRequest || "",
                    resolvedEncryptedRequest: resolved?.resolvedEncryptedRequest || encryptedRequest
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

    useEffect(() => {
        const storedToken = sessionStorage.getItem("accessToken");

        if (!storedToken) {
            clearTokenTimers();
            return;
        }

        if (isTokenExpired(storedToken)) {
            logout("Your login session has expired.", true);
            return;
        }

        startTokenSession(storedToken);
        return () => {
            clearTokenTimers();
        };
    }, []);

    useEffect(() => {
        if (!token) { clearTokenTimers(); return }
        if (isTokenExpired(token)) { logout("Your login session has expired.", true); return }
        sessionStorage.setItem("accessToken", token);
        startTokenSession(token);

        return () => {
            clearTokenTimers();
        };
    }, [token]);

    useEffect(() => {
        if (!user) return;
        sessionStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const login = (userData, accessToken) => {
        try {
            if (!accessToken) {
                console.error("Login failed: access token missing");
                return;
            }

            if (isTokenExpired(accessToken)) {
                console.error("Login failed: token already expired");
                return;
            }

            const authenticatedUser = { ...userData, ulbId: userData?.ulbId || user?.ulbId || DEFAULT_ULB_ID };
            setUser(authenticatedUser);
            setToken(accessToken);
            sessionStorage.setItem("user", JSON.stringify(authenticatedUser));
            sessionStorage.setItem("accessToken", accessToken);
            startTokenSession(accessToken);
        } catch (error) {
            console.error("Login token error:", error);
            logout("Unable to validate your login session. Please login again.", true);
        }
    };

    const manualLogout = () => {
        logout("You have been logged out.", false);
    };

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout: manualLogout, requestInitialized, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;