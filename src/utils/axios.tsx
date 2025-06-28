import { getNewAccessToken } from '@/api/auth';
import { getAccessToken, getRefreshToken, setAccessTokenInStore } from '@/store/authStore';
import axios from 'axios';
const isDevelopment = false;

const BASE_URL = isDevelopment
  ? process.env.EXPO_PUBLIC_LOCAL_API_URL
  : process.env.EXPO_PUBLIC_API_URL;


const axiosPublic = axios.create({
    baseURL :BASE_URL,
});

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers:{ 'Content-Type': 'application/json' },
    withCredentials: true,
})

axiosPrivate.interceptors.request.use(
    async (config)=>{
        const accessToken = getAccessToken() ; 
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        console.error("Error in request interceptor:", error);
        return Promise.reject(error);
    }
)


axiosPrivate.interceptors.response.use(
    response => response,
    async error=>{
        if (error.response && error.response.status === 403) {
           const refreshToken = getRefreshToken()
            if (!refreshToken) {
                return Promise.reject(error);
            }
            try {
                const newAccessToken = await getNewAccessToken(refreshToken)
                setAccessTokenInStore(newAccessToken);
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosPrivate(error.config)
            }catch(err){
                console.error("Error refreshing token:", err);
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
)

export { axiosPrivate, axiosPublic };

