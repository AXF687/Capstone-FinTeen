import api from "./api";

const tabunganService = {
  getAll: async () => {
    const res = await api.get('/target-tabungan');
    return Array.isArray(res.data) ? res.data : [];
  },

  create: async (data) => {
    const res = await api.post('/target-tabungan', {
      namaTarget: data.nama,
      nominalTarget: Number(data.target_nominal),
      targetBulan: Number(data.deadline_bulan),
    });
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/target-tabungan/${id}`);
    return res.data;
  },

  updateStatus: async (id, statusData) => {
    const res = await api.put(`/target-tabungan/${id}`, { status: statusData });
    return res.data;
  }
};

export default tabunganService;