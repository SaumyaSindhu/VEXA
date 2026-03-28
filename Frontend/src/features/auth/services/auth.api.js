import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({ email, username, password }) {
    
    try {
        const response = await api.post("/api/auth/register", {
          email,
          username,
          password,
        });

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Registration failed" }; 
    }
}

export async function login({ email, password }) {
    
    try {
        const response = await api.post("/api/auth/login", { email, password });

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Login failed" }
    }
}

export async function getMe() {
    
    try {
        const response = await api.get("/api/auth/get-me");

        return response.data;
    } catch (err) {
        throw err.response?.data || { message: "Failed to fetch user" }
    }
}