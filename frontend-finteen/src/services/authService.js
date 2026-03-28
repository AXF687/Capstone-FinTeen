import api from './api';

const authService = {
    requestOtp: async ({ nama, email, password }) => {
        const res = await api.post('/auth/register-request', { nama, email, password });
        return res.data;
    },

    verifyOtp: async ({ email, otp }) => {
        const res = await api.post('/auth/verify-otp', { email, otp });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return res.data;
    },

    login: async ({ email, password }) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, user } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return res.data;
    },

    setupProfil: async ({ status, saldo_awal, target_bulanan, nama, email }) => {
        const res = await api.put('/users/me', { status, saldo_awal, target_bulanan, nama, email });
        return res.data;
    },

    getProfil: async () => {
        const res = await api.get('/users/me');
        return res.data;
    },

    changePassword: async ({ passwordLama, passwordBaru }) => {
        const res = await api.put('/users/me/password', { passwordLama, passwordBaru });
        return res.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isLoggedIn: () => !!localStorage.getItem('token'),
};

export default authService;