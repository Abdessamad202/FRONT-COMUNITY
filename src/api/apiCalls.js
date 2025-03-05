import apiClient from "./axios";

export const logIn = async (formData) => {
  const response = await apiClient.post('/login', formData);
  return response.data
}
export const register = async (data) => {
  const response = await apiClient.post('/register/step-1',data,);
  return response.data
}

export const logOut = async () => {
  const response = await apiClient.post("/logout", {})
  return response.data
}

export const getUser = async (userId) => {
  const response = await apiClient.get(`/user/${userId}`)
  return response.data
}
// export const getPosts = async () => {
//   const response = await apiClient.get(`/posts`)
//   return response.data
// }

export const completeProfile = async (id,data) => {
  const response = await apiClient.post(`/register/step-3/${id}`, data)
  return response.data
}


export const verifyMail = async (data) => {
  const response = await apiClient.post(`/verify-mail`, data)
  return response.data
}
// change password
export const changePassword = async (id,data) => {
  const response = await apiClient.post(`/change-password/${id}`, data)
  return response.data
}
export const verificationByLocation = (pathname,id,data) => {
  if (pathname === "/verify-code") {
    return checkCode(data,id)
  }
  return VerificationEmail(id ,data)
}
const VerificationEmail = async (id ,data) => {
  const response = await apiClient.post(`/register/step-2/${id}`, data)
  return response.data
}
const checkCode = async (data,id) => {
  const response = await apiClient.post(`/check-code/${id}`, data)
  return response.data
}
export const reSendCode = (pathname,id) => {
  if (pathname === "/verify-code") {
    return resendVerificationEmailCode(id)
  }
  return resendConfirmationEmailCode(id)
}
const resendConfirmationEmailCode = async (id) => {
  const response = await apiClient.post(`/register/confirm/resend-code/${id}`, {})
  return response.data
}
const resendVerificationEmailCode = async (id) => {
  const response = await apiClient.post(`/verify/resend-code/${id}`, {})
  return response.data
}

export const getPosts = async ({ pageParam = 1 }) => {
  const response = await apiClient.get(`/posts?page=${pageParam}`);
  return {
    posts: response.data.posts,
    nextPage: response.data.nextPage ? pageParam + 1 : null, // تحديد الصفحة الجاية
  };
};
export const getCommetsPost = async (postId, pageParam) => {
  const response = await apiClient.get(`/posts/${postId}/comments?page=${pageParam}`);
  return {
    total : response.data.total,
    comments: response.data.comments,
    nextPage:response.data.nextPage ? pageParam + 1 : null
  };
}

export const likeOrUnlikePost = async (postId, isLiked) => {
  if (isLiked) {
    return unlikePost(postId)
  } else {
    return likePost(postId)
  }
}
const likePost = async (postId) => {
  const response = await apiClient.post(`/posts/${postId}/like`)
  return response.data
}

const unlikePost = async (postId) => {
  const response = await apiClient.delete(`/posts/${postId}/unlike`)
  return response.data
}

export const addComment = async (postId, data) => {
  const response = await apiClient.post(`/posts/${postId}/comments`, data)
  return response.data
}
export const deleteComment = async (commentId) => {
  const response = await apiClient.delete(`/comments/${commentId}`, {});
  return response.data;
};
export const updateComment = async (commentId, data) => {
  const response = await apiClient.put(`/comments/${commentId}`, data);
  return response.data;
};
export const getUserPosts = async (userId) => {
  const response = await apiClient.get(`/user/${userId}/posts`)
  return response.data || []
}
export const addPost = async (data) => {
  const response = await apiClient.post(`/posts`, data,{headers: {
    'Content-Type': 'multipart/form-data', // ⚠️ ضروري باش يفهم Laravel أنو صورة
  }})
  return response.data
}
export const deletePost = async (postId) => {
  const response = await apiClient.delete(`/posts/${postId}`)
  return response.data
}