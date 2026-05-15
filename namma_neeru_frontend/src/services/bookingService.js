import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/bookings';

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(API_URL, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message;
    }
};

export const getPendingBookings = async () => {
    try {
        const response = await axios.get(`${API_URL}/pending`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message;
    }
};

export const acceptBooking = async (bookingId) => {
    try {
        const response = await axios.put(`${API_URL}/${bookingId}/accept`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message;
    }
};

export const rejectBooking = async (bookingId) => {
    try {
        const response = await axios.put(`${API_URL}/${bookingId}/reject`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message;
    }
};
