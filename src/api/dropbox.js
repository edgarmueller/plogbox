import { Dropbox } from 'dropbox';

export const DROPBOX_TOKEN_NAME = 'plog.dropbox.token';

const dbx = new Dropbox({
  clientId: process.env.CLIENT_ID,
  accessToken: localStorage.getItem(DROPBOX_TOKEN_NAME)
});

export const getAuthUrl = () =>
  dbx.getAuthenticationUrl('http://localhost:3000/auth');

export const fetchFiles = () => {
  dbx.filesListFolder({ path: '' })
    // eslint-disable-next-line no-console
    .then(response => console.log(response))
    // eslint-disable-next-line no-console
    .catch(error => console.log(error));
};

export const logout = () => {
  dbx.authTokenRevoke();
  localStorage.removeItem(DROPBOX_TOKEN_NAME);
};

export const saveToken = (token) => {
  localStorage.setItem(DROPBOX_TOKEN_NAME, token);
};

export const setAccessToken = token =>
  dbx.setAccessToken(token);

export const getUser = () =>
  dbx.usersGetCurrentAccount();

export const testToken = () =>
  dbx.usersGetCurrentAccount()
    .then(
      () => true,
      () => false
    );

export const createTag = tag => dbx.filesCreateFolderV2({ path: `/${tag}`, autorename: true });

export const fetchTags = () => dbx.filesListFolder({ path: '' })
  .then(files =>
    files.entries.filter(file => file['.tag'] === 'folder'));
