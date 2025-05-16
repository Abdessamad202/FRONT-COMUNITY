import apiClient from "./axios";

export const logIn = async (formData) => {
  const response = await apiClient.post('/login', formData);
  return response.data
}
export const register = async (data) => {
  const response = await apiClient.post('/register/', data,);
  return response.data 
}

export const logOut = async () => {
  const response = await apiClient.post("/logout", {})
  return response.data
}

export const getUser = async () => {
  const response = await apiClient.get(`/user`)
  return response.data
}
export const getFriendRequests = async ({ pageParam = 1 }) => {
  const response = await apiClient.get(`/friend-requests/received?page=${pageParam}`);
  return response.data;
};
export const getPostLikers = async (post) => {
  const response = await apiClient.get(`/posts/${post}/likers`);
  return response.data;
};
export const removeFriend = async (friend) => {
  const response = await apiClient.delete(`/friends/${friend}`);
  return response.data;
}
export const profile = async (user) => {
  if (!user) throw new Error("User ID is required");

  const response = await apiClient.get(`/profiles/${user}`);
  return response.data.user;
};
export const updateProfile = async (profile) => {
  try {
    const response = await apiClient.post('/profile', profile, {
      headers: {
        'Content-Type': 'multipart/form-data', // ⚠️ ضروري باش يفهم Laravel أنو صورة
      }
    }); // Assuming the API endpoint is `/profile`
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; // You can handle this error accordingly in your UI
  }
};

// export const getFriendRequestsV2 = async () => {
//   const response = await apiClient.get(`/friend-requests/received/v2`);
//   return response.data;
// };

// export const getPosts = async () => {
//   const response = await apiClient.get(`/posts`)
//   return response.data
// }

export const completeProfile = async (id, data) => {
  const response = await apiClient.post(`/complete-profile`, data)
  return response.data
}


export const sendResetPasswordCode = async (data) => {
  const response = await apiClient.post(`/send-reset-password-code`, data)
  return response.data
}
// change password
export const resetPassword = async (data) => {
  const response = await apiClient.post(`/reset-password`, data)
  return response.data
}
export const VerificationEmail = async (data) => {
  const response = await apiClient.post(`/verify-email`, data)
  return response.data
}
export const validateResetCode = async (data) => {
  const response = await apiClient.post(`/validate-reset-code`, data)
  return response.data
}
export const resendVerificationEmailCode = async () => {
  const response = await apiClient.post(`/send-verification-code`, {})
  return response.data
}
export const search = async (query) => {
  const response = await apiClient.get(`/profiles/search?query=${query}`)
  return response.data
}
export const toggleSavePost = async (postId) => {
  const response = await apiClient.post(`/posts/${postId}/toggle-save`);
  return response.data;
};
export const fetchSavedPosts = async () => {
  const response = await apiClient.get('/saved-posts');
  return response.data.posts;
};
export const fetchPost = async (post) => {
  const response = await apiClient.get(`/posts/${post}`)
  return response.data
}
export const respondToFriendRequest = async (friendRequest, action) => {
  const response = await apiClient.patch(`/friend-request/${friendRequest}/${action}`)
  return response.data
}
export const getPosts = async ({ pageParam = 1 }) => {
  const response = await apiClient.get(`/posts?page=${pageParam}`);
  return response.data
};



export const toggleLikePost = async (postId) => {
  const response = await apiClient.post(`/posts/${postId}/like`)
  return response.data
}

export const addComment = async (postId, data) => {
  const response = await apiClient.post(`/posts/${postId}/comments`, data)
  return response.data
}
export const deleteComment = async (postId, commentId) => {
  const response = await apiClient.delete(`/posts/${postId}/comments/${commentId}`, {});
  return response.data;
};
export const updateComment = async (postId, commentId, data) => {
  const response = await apiClient.put(`/posts/${postId}/comments/${commentId}`, data);
  return response.data;
};

export const createPost = async (data) => {
  const response = await apiClient.post(`/posts`, data, {
    headers: {
      'Content-Type': 'multipart/form-data', // ⚠️ ضروري باش يفهم Laravel أنو صورة
    }
  })
  return response.data
}
export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/posts/${postId}`)
  return response.data
}
export const updatePost = async (postId, formData) => {
  const response = await apiClient.post(`/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
// File: components/api/apiCalls.js
export const sendFriendRequest = async (userId) => {
  const response = await apiClient.post(`/friend-request/${userId}`);
  return response.data;
};
export const cancelFriendRequest = async (userId) => {
  const response = await apiClient.delete(`/friend-request/${userId}`);
  return response.data;
};
export const getFriends = async ({ pageParam = 1 }) => {
  const response = await apiClient.get(`/friends?page=${pageParam}`);
  return response.data;
};
export const changePassword = async (data) => {
  const response = await apiClient.patch(`/change-password`, data)
  return response.data
}
export const readMessages = async (conversationId) => {
  const response = await apiClient.post(`/read-messages/${conversationId}`)
  return response.data
}
export const getConversations = async ({pageParam = 1}) => {
  const response = await apiClient.get(`/conversations?page=${pageParam}`)
  return response.data
}
export const sendMessage = async (conversation,message) => {
const response = await apiClient.post(`/messages/${conversation}`, message);
  return response.data;
};
export const typing = async (conversationId) => {
  const response = await apiClient.post(`/typing`,{conversationId})
}