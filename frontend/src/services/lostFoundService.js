import axiosInstance from "./axiosInstance";

const lostFoundService = {
  async getPosts(params = {}) {
    const { data } = await axiosInstance.get("/lost-found/", { params });
    return data;
  },

  async getPost(id) {
    const { data } = await axiosInstance.get(`/lost-found/${id}/`);
    return data;
  },

  async createPost(postData) {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });

    const { data } = await axiosInstance.post("/lost-found/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async updatePost(id, postData) {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (postData[key] !== null && postData[key] !== undefined) {
        formData.append(key, postData[key]);
      }
    });

    const { data } = await axiosInstance.put(`/lost-found/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async deletePost(id) {
    const { data } = await axiosInstance.delete(`/lost-found/${id}/`);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await axiosInstance.patch(`/lost-found/${id}/status/`, { status });
    return data;
  },

  async getComments(postId) {
    const { data } = await axiosInstance.get(`/lost-found/${postId}/comments/`);
    return data;
  },

  async addComment(postId, content) {
    const { data } = await axiosInstance.post(`/lost-found/${postId}/comments/`, { content });
    return data;
  },

  async revealContact(id) {
    const { data } = await axiosInstance.get(`/lost-found/${id}/reveal-contact/`);
    return data;
  }
};

export default lostFoundService;
