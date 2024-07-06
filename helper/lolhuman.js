import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.lolhuman.xyz/api/',
    params: {
        apikey: 'yatanokagami'
    }
});

export const tebak = async (url, config = {}) => {
    try {
        return await axiosInstance.get('tebak/' + url, config);
    } catch (error) {
        console.error('Error in tebak request:', error);
        throw error; // Rethrow the error for handling in calling functions
    }
};
export const lol = async (url, config = {}) => {
    try {
        return await axiosInstance.get(url, config);
    } catch (error) {
        console.error('Error in tebak request:', error);
        throw error; // Rethrow the error for handling in calling functions
    }
};
