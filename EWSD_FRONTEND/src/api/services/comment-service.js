import { axiosInstance } from "../axios-instance";

export const commentService = {
  addComment: async (contributionId, content, parentId = null) => {
    const payload = { content };
    if (parentId) {
      payload.parent_id = parentId;
    }
    return (await axiosInstance.post(`/contributions/${contributionId}/comments`, payload)).data
  },

  getContributionComments: async(contributionId) => {
    return (await axiosInstance.get(`/contributions/${contributionId}/comments`)).data
  },

  deleteComment: async(commentId) => {
    return (await axiosInstance.delete(`/comments/${commentId}`)).data
  },

  editComment: async(commentId, content) => {
    return (await axiosInstance.patch(`/comments/${commentId}`, { content })).data
  }
};
