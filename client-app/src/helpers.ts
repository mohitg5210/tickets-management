import { notification } from 'antd';
import { NOTIFICATION_TYPES } from './constants/common';

export const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
};
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};
export const removeAccessToken = () => {
    return localStorage.removeItem('accessToken');
};

export const showNotificationMessage = (notificationType: NOTIFICATION_TYPES, message: string) => {
    return notification[notificationType]({
        message: '',
        description: message || 'Something went wrong',
    });
};