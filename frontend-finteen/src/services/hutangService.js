import api from "./api";

const hutangService = {
  getAll: async () => {
    const response = await api.get("/hutang"); 
    return Array.isArray(response.data) ? response.data : []; 
  },

  create: async (payload) => {
    const dataKirim = {
      totalPinjaman: Number(payload.nominal),
      bungaTahunan: Number(payload.bunga),
      lamaBulan: Number(payload.lamaBulan),
      tempatHutang: payload.tempatHutang
    };
    
    const response = await api.post("/hutang", dataKirim);
    return response.data;
  },

  update: async (id, payload) => {
    const dataKirim = {
      totalPinjaman: Number(payload.nominal),
      bungaTahunan: Number(payload.bunga),
      lamaBulan: Number(payload.lamaBulan),
      tempatHutang: payload.tempatHutang
    };

    const response = await api.put(`/hutang/${id}`, dataKirim);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/hutang/${id}`);
    return response.data;
  }
};

export default hutangService;