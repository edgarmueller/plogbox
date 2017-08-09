import Axios from 'axios';
import { BASE_URL } from '../constants';

const getHeaderToken = () => ({
  headers: {
    'X-Auth-Token': localStorage.getItem('token'),
  },
});

export const fetchPosts = () =>
  Axios.get(
    `${BASE_URL}/posts`,
    getHeaderToken(),
  );

export const createPost = newPost =>
  Axios
    .put(
      `${BASE_URL}/posts`,
      newPost,
      getHeaderToken(),
    );

export const updatePost = dataSource =>
  Axios
    .post(
      `${BASE_URL}/posts/${dataSource.id}`,
      dataSource,
      getHeaderToken(),
    );

export const fetchBlocks = postId =>
  Axios.get(
    `${BASE_URL}/posts/${postId}/blocks`,
    getHeaderToken(),
  );

export const deletePost = postId =>
  Axios
    .delete(
      `${BASE_URL}/posts/${postId}`,
      getHeaderToken(),
    );

export const loginUser = (email, password, rememberMe) =>
  Axios
    .post(
      `${BASE_URL}/sign-in`,
      { email, password, rememberMe },
      { header: { 'Content-Type': 'application/json' } },
    );

export const logoutUser = () => Axios
  .post(
    `${BASE_URL}/sign-out`,
    {},
    getHeaderToken(),
  );

export const registerUser = signUpToken =>
  Axios
    .post(`${BASE_URL}/sign-up`, signUpToken);

export const addBlock = (postId, block) =>
  Axios.put(
    `${BASE_URL}/posts/${postId}/blocks`,
    block,
    getHeaderToken(),
  );

export const removeBlock = (postId, block) =>
  Axios.delete(
    `${BASE_URL}/posts/${postId}/blocks/${block.id}`,
    getHeaderToken(),
  );


export const updateBlock = (postId, block) => {
  const url = `${BASE_URL}/posts/${postId}/blocks/${block.id}`;
  return Axios.post(
    url,
    block,
    getHeaderToken(),
  );
};

export const addTag = (postId, tag) => {
  const url = `${BASE_URL}/tags/${postId}`;
  return Axios.post(
    url,
    tag,
    getHeaderToken(),
  );
};

export const removeTag = (postId, tagId) => {
  const url = `${BASE_URL}/tags/${postId}/${tagId}`;
  return Axios.delete(
    url,
    getHeaderToken(),
  );
};

export const fetchTags = () => {
  const url = `${BASE_URL}/tags`;
  return Axios.get(
    url,
    getHeaderToken(),
  );
};

export const testToken = (token) => {

  return Axios
    .get(
      `${BASE_URL}/is-signed-in`,
      { headers: { 'X-Auth-Token': token } },
    );
};

export const forgotPassword = (email) => {
  const url = `${BASE_URL}/api/password/forgot`;
  return Axios.post(
    url,
    {
      email,
    },
    getHeaderToken(),
  );
};

export const resetPassword = (token, newPassword) => {
  const url = `${BASE_URL}/api/password/reset/${token}`;
  return Axios.post(
    url,
    {
      password: newPassword,
    },
    getHeaderToken(),
  );
};

export const changePassword = (currentPassword, newPassword) => {
  const url = `${BASE_URL}/api/password/change`;
  return Axios.post(
    url,
    {
      currentPassword,
      newPassword,
    },
    getHeaderToken(),
  );
};