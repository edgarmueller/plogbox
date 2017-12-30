import Axios from 'axios';
import { BASE_URL } from '../constants';

const readCookie = (cname) => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
};

const getHeaderToken = () => ({
  headers: {
    'X-Auth-Token': localStorage.getItem('token'),
    'Csrf-Token': readCookie('PLAY_CSRF_TOKEN'),
    'Content-Type': 'application/json',
  },
});

export const fetchPosts = () =>
  Axios.get(
    `${BASE_URL}/api/posts`,
    getHeaderToken(),
  );

export const createPost = newPost =>
  Axios
    .put(
      `${BASE_URL}/api/posts`,
      newPost,
      getHeaderToken(),
    );

export const searchPost = postTitle =>
  Axios
    .get(
      `${BASE_URL}/api/posts/search/${postTitle}`,
      getHeaderToken(),
    );

export const updatePost = post =>
  Axios
    .post(
      `${BASE_URL}/api/posts/${post.id}`,
      post,
      getHeaderToken(),
    );

export const fetchBlocks = postId =>
  Axios.get(
    `${BASE_URL}/api/posts/${postId}/blocks`,
    getHeaderToken(),
  );

export const deletePost = postId =>
  Axios
    .delete(
      `${BASE_URL}/api/posts/${postId}`,
      getHeaderToken(),
    );

export const loginUser = (email, password, rememberMe) =>
  Axios
    .post(
      `${BASE_URL}/sign-in`,
      { email, password, rememberMe },
      getHeaderToken(),
    );

export const logoutUser = () => Axios
  .post(
    `${BASE_URL}/sign-out`,
    {},
    getHeaderToken(),
  );

export const registerUser = signUpToken =>
  Axios
    .post(
      `${BASE_URL}/sign-up`,
      signUpToken,
      getHeaderToken(),
    );

export const addBlock = (postId, block) =>
  Axios.put(
    `${BASE_URL}/api/posts/${postId}/blocks`,
    block,
    getHeaderToken(),
  );

export const removeBlock = (postId, block) =>
  Axios.delete(
    `${BASE_URL}/api/posts/${postId}/blocks/${block.id}`,
    getHeaderToken(),
  );

export const upload = (postId, file) => {
  const url = `${BASE_URL}/api/posts/${postId}/upload/${file.name}`;

  const data = new FormData();
  data.append(file.name, file);

  return Axios.post(
    url,
    data,
    getHeaderToken(),
  );
};

export const download = (postId, file) => {
  const url = `${BASE_URL}/api/posts/${postId}/file/${file}`;
  return Axios.get(
    url,
    {
      headers: {
        'X-Auth-Token': localStorage.getItem('token'),
        'Csrf-Token': readCookie('PLAY_CSRF_TOKEN'),
      },
      responseType: 'blob',
    },
  );
};

export const updateBlock = (postId, block) => {
  const url = `${BASE_URL}/api/posts/${postId}/blocks/${block.id}`;
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

export const testToken = token => Axios
    .get(
      `${BASE_URL}/is-signed-in`,
      { headers: { 'X-Auth-Token': token } },
    );

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

export const activateAccount = token =>
  Axios.get(
    `${BASE_URL}/api/account/activate/${token}`,
  );
