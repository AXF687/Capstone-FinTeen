import api from "./api";

const analisisService = { 
  getAnalisis: async () => {
    const res = await api.get('/analisis');
    return res.data; 
  },
};

export default analisisService;