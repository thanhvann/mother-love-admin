import { User } from '@/models/User';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const isAccessTokenExpired = (accessToken: string): boolean => {
    try {
        const decodedToken: { exp: number } = jwtDecode(accessToken);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();
        return currentTime > expirationTime;
    } catch (error) {
        console.error('Error decoding access token:', error);
        return true;
    }
};

export const refreshTokenIfNeeded = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || isAccessTokenExpired(accessToken)) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/refresh_token', {
            // const response = await axios.post('https://motherlove-api.onrender.com/api/v1/auth/refresh_token', {
                refresh_token: localStorage.getItem('refreshToken')
            });
            const newAccessToken = response.data.access_token;
            localStorage.setItem('accessToken', newAccessToken);
            console.log('Refreshed access token successfully');
            return true;
        } catch (error) {
            console.error('Failed to refresh access token:', error);
            return false;
        }
    }
    return true;
};

export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/user/login', {
        // const response = await axios.post('https://motherlove-api.onrender.com/api/v1/auth/user/login', {
            userNameOrEmailOrPhone: username,
            password: password
        });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        console.log('Login successful');
        return true;
    } catch (error) {
        console.error('Login failed', error);
        return false;
    }
};

export const getUserInfo = async (): Promise<User | null> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || isAccessTokenExpired(accessToken)) {
            throw new Error('Access token is missing or expired');
        }
        const response = await axios.get('http://localhost:8080/api/v1/auth/user/info', {
        // const response = await axios.get('https://motherlove-api.onrender.com/api/v1/auth/user/info', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data as User;
    } catch (error) {
        console.error('Failed to get user info:', error);
        return null;
    }
};
