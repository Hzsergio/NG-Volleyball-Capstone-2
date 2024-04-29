import axios from "axios"
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';
import { isPending } from "@reduxjs/toolkit";

const BACKEND_DOMAIN = "http://18.208.190.100:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`


// Create a new Axios instance
const axiosInstance = axios.create({
    baseURL: BACKEND_DOMAIN,
    headers: {
        "Content-type": "application/json"
    }
});
const refreshAccessToken = async (refreshToken) => {
    try {
        // Make a request to your backend to refresh the access token using the refresh token
        const response = await axios.post(`${BACKEND_DOMAIN}/api/v1/auth/jwt/refresh/`, { refresh: refreshToken });

        // Extract the new access token from the response
        const newAccessToken = response.data.access;
        // Return the new access token
        return newAccessToken;
    } catch (error) {
        // If token refresh fails, throw an error
        throw new Error("Failed to refresh access token");
    }
}; 

const isTokenExpired = (token) => {
    if (!token) {
        return true;
    }

    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
};

axiosInstance.interceptors.request.use(
    async (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const accessToken = user ? user.access : null;
        const refreshToken = user ? user.refresh : null;
        const isExpired = isTokenExpired(accessToken);
        console.log(isExpired)
        if (isExpired && refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                user.access = newAccessToken;
                localStorage.setItem("user", JSON.stringify(user));
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error("Failed to refresh access token:", error);
                localStorage.removeItem("user");
                throw error;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);




// Register user
const register = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/users/", userData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to register user");
    }
};

// Login user
const login = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/jwt/create/", userData);
        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw new Error("Failed to login user");
    }
};

// Logout 
const logout = () => {
    localStorage.removeItem("user");
};

// Activate user
const activate = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/users/activation/", userData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to activate user");
    }
};

// Reset Password
const resetPassword = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/users/reset_password/", userData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to reset password");
    }
};

// Reset Password
const resetPasswordConfirm = async (userData) => {
    try {
        const response = await axiosInstance.post("/api/v1/auth/users/reset_password_confirm/", userData);
        return response.data;
    } catch (error) {
        throw new Error("Failed to reset password");
    }
};

// Get User Info
const getUserInfo = async (accessToken) => {
    try {
        const config = {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        };
        const response = await axiosInstance.get("/api/v1/auth/users/me/", config);
        return response.data;
    } catch (error) {
        throw new Error("Failed to get user info");
    }
};

// Define authentication functions
const authService = { register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo };

export default authService;
