import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_ULB_ID = import.meta.env.VITE_DEFAULT_ULB_ID;

const AuthProvider = ({ children }) => {

    const inactivityTimerRef = useRef(null);
    const INACTIVITY_LIMIT = 30 * 1000;

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
    const [refreshToken, setRefreshToken] = useState(() => sessionStorage.getItem("refreshToken") || null);
    const [requestInitialized, setRequestInitialized] = useState(false);

    const tokenCheckIntervalRef = useRef(null);
    const tokenExpiryTimeoutRef = useRef(null);
    const logoutInProgressRef = useRef(false);

    const getLogoutPath = () => {
        const activeLayout = sessionStorage.getItem("activeLayout");

        if (activeLayout === "admin") {
            return "/app/frmEmpLogin";
        }

        return "/";
    };

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

        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }

        const logoutPath = getLogoutPath();

        clearTokenTimers();

        setUser(null);
        setToken(null);
        setRefreshToken(null);

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("ulbId");
        sessionStorage.removeItem("corpId");
        sessionStorage.removeItem("citizen");
        sessionStorage.removeItem("activeLayout");

        if (showPopup) {
            await Swal.fire({
                icon: "warning",
                text: reason,
                confirmButtonText: "Login Again",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        }

        window.location.replace(logoutPath);
    };

    const refreshAccessToken = async () => {
        // alert("Refresh token function called");

        try {
            const storedRefreshToken = refreshToken || sessionStorage.getItem("refreshToken");

            if (!storedRefreshToken) {
                Swal.fire({
                    // icon: "warning",
                    // title: "Refresh Token Missing",
                    text: "Refresh token not found",
                    confirmButtonText: "OK",
                });
                return null;
            }

            // alert("Calling refresh-token API");

            const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`,
                {
                    refreshToken: storedRefreshToken,
                }
            );

            console.log("Refresh API response:", response.data);

            const newAccessToken = response.data?.data?.token;

            if (!newAccessToken) {
                Swal.fire({
                    text: "New access token not returned by API",
                    confirmButtonText: "OK",
                });
                return null;
            }

            setToken(newAccessToken);
            sessionStorage.setItem("accessToken", newAccessToken);

            return newAccessToken;
        } catch (error) {
            console.error("Refresh token API error:", error?.response?.data || error.message);
            Swal.fire({
                text: "Refresh token API failed",
                confirmButtonText: "OK",
            });
            return null;
        }
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
                refreshAccessToken();
                return;
            }

            if (tokenExpiryTimeoutRef.current) {
                clearTimeout(tokenExpiryTimeoutRef.current);
            }

            // Refresh the token 30 seconds before expiry
            const refreshTime = Math.max(remainingTime - 30000, 1000);

            tokenExpiryTimeoutRef.current = setTimeout(async () => {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    scheduleTokenExpiryLogout(newToken);
                }
            }, refreshTime);

            console.log(
                `Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
            );
        } catch (error) {
            console.error("Failed to schedule token refresh:", error);
            logout("Your login session has expired.", true);
        }
    };

    const startTokenCheckInterval = () => {
        if (tokenCheckIntervalRef.current) {
            clearInterval(tokenCheckIntervalRef.current);
        }

        tokenCheckIntervalRef.current = setInterval(async () => {
            const currentToken = sessionStorage.getItem("accessToken");

            if (!currentToken) {
                return;
            }

            try {
                const decoded = jwtDecode(currentToken);
                const remainingTime = decoded.exp * 1000 - Date.now();

                console.log(
                    "Token remaining time:",
                    Math.round(remainingTime / 1000),
                    "seconds"
                );

                // Refresh 30 seconds before expiry
                if (remainingTime <= 30000) {
                    // alert("Refreshing access token...");

                    const newToken = await refreshAccessToken();

                    if (newToken) {
                        // alert("Access token refreshed successfully");
                        scheduleTokenExpiryLogout(newToken);
                    }

                    return;
                }

                console.log("Token still valid");
            } catch (error) {
                console.error("Token check error:", error);
            }
        }, 10000); // Check every 10 seconds
    };

    const startTokenSession = (currentToken) => {
        if (!currentToken) return;

        // if (isTokenExpired(currentToken)) {
        //     logout("Your login session has expired.", true);
        //     return;
        // }

        clearTokenTimers();
        scheduleTokenExpiryLogout(currentToken);
        startTokenCheckInterval();
    };

    const resetInactivityTimer = useCallback(() => {
        if (!token || !user) return;

        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        inactivityTimerRef.current = setTimeout(() => {
            logout("You were logged out due to 15 minutes of inactivity.", true);
        }, INACTIVITY_LIMIT);
    }, [token, user]);

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

    useEffect(() => {
        if (!token || !user) return;

        const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

        const handleActivity = () => {
            resetInactivityTimer();
        };

        events.forEach((event) => { window.addEventListener(event, handleActivity) });
        resetInactivityTimer();

        return () => {
            events.forEach((event) => { window.removeEventListener(event, handleActivity); });

            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [token, user, resetInactivityTimer]);

    const login = (userData, accessToken, newRefreshToken) => {
        try {
            if (!accessToken) {
                console.error("Login failed: access token missing");
                return;
            }

            if (!newRefreshToken) {
                console.error("Login failed: refresh token missing");
                return;
            }

            if (isTokenExpired(accessToken)) {
                console.error("Login failed: token already expired");
                return;
            }

            const authenticatedUser = {
                ...userData,
                ulbId: userData?.ulbId || user?.ulbId || DEFAULT_ULB_ID,
            };

            setUser(authenticatedUser);
            setToken(accessToken);
            setRefreshToken(newRefreshToken);

            sessionStorage.setItem(
                "user",
                JSON.stringify(authenticatedUser)
            );

            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", newRefreshToken);

            console.log("Access token saved:", accessToken);
            console.log("Refresh token saved:", newRefreshToken);

            startTokenSession(accessToken);
        } catch (error) {
            console.error("Login token error:", error);
            logout(
                "Unable to validate your login session. Please login again.",
                true
            );
        }
    };

    const manualLogout = () => {
        logout("You have been logged out.", false);
    };

    return (
        // <AuthContext.Provider value={{ user, token, setUser, setToken, login, logout: manualLogout, requestInitialized, isTokenExpired }}>
        //     {children}
        // </AuthContext.Provider>
        <AuthContext.Provider value={{ user, token, refreshToken, setUser, setToken, setRefreshToken, login, refreshAccessToken, logout: manualLogout, requestInitialized, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;