import axiosInstance from "./axiosInstance";

const noticeService = {
  async getNotices(params = {}) {
    const { data } = await axiosInstance.get("/notices/", {
      params,
    });
    return data;
  },

  async createNotice(noticeData) {
    const formData = new FormData();

    formData.append("title", noticeData.title);
    formData.append("body", noticeData.body);
    formData.append("category", noticeData.category.toUpperCase());
    formData.append("scope", noticeData.scope.toUpperCase());

    if (noticeData.image) {
      formData.append("image", noticeData.image);
    }

    const { data } = await axiosInstance.post("/notices/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async updateNotice(id, noticeData) {
    const formData = new FormData();

    if (noticeData.title) formData.append("title", noticeData.title);

    if (noticeData.body) formData.append("body", noticeData.body);

    if (noticeData.category)
      formData.append("category", noticeData.category.toUpperCase());

    if (noticeData.scope)
      formData.append("scope", noticeData.scope.toUpperCase());

    if (noticeData.image instanceof File)
      formData.append("image", noticeData.image);

    const { data } = await axiosInstance.put(`/notices/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  async deleteNotice(id) {
    await axiosInstance.delete(`/notices/${id}/`);
    return true;
  },

async togglePin(id) {
  const { data } = await axiosInstance.patch(
    `/notices/${id}/pin/`
  );

  return data;
},
};

export default noticeService;
