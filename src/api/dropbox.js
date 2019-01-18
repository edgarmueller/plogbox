import { Dropbox } from 'dropbox';

export const DROPBOX_TOKEN_NAME = 'plog.dropbox.token';

const dbx = new Dropbox({
  clientId: process.env.REACT_APP_CLIENT_ID,
  accessToken: localStorage.getItem(DROPBOX_TOKEN_NAME)
});

export const getAuthUrl = () =>
  dbx.getAuthenticationUrl('http://localhost:3000/auth');

// export const fetchFiles = () => {
//   dbx.filesListFolder({ path: '' })
//     // eslint-disable-next-line no-console
//     .then(response => console.log(response))
//     // eslint-disable-next-line no-console
//     .catch(error => console.log(error));
// };

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

export const createPost = (tag, fileName) =>
  dbx.fileRequestsCreate({
    title: fileName,
    destination: `/${tag}`,
    open: false
  });

// export const createPost = (tag, fileName, file) =>
//   dbx.filesUpload()
//     title: fileName,
//     destination: `/${tag}`,
//     open: false
//   });

export const createTag = tag => dbx.filesCreateFolderV2({ path: `/${tag}`, autorename: true });

export const renameTag = (tag, newName) => dbx.filesMoveV2({
  from_path: `/${tag}`,
  to_path: `/${newName}`,
  autorename: true
});

export const deleteTag = tag => dbx.filesDeleteV2({ path: `/${tag}`});

export const fetchTags = () => dbx.filesListFolder({ path: '' })
  .then(files =>
    files.entries.filter(file => file['.tag'] === 'folder'));

export const fetchFiles = tagName => dbx.filesListFolder({ path: `/${tagName}` })
  .then(files =>
    files.entries.filter(file => file['.tag'] === 'file'));

export const fetchFile = file => dbx.filesDownload({ path: file })
  .then((resp) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new Error('Problem parsing input file.'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(resp.fileBlob);
    });
  });

export const deleteFile = file => dbx.filesDeleteV2({ path: file })

export const pushFile = (file, text) => dbx.filesUpload({
  path: file,
  contents: text,
  mode: { '.tag': 'overwrite' },
  autorename: false
})
  .then((data) => { console.log('UPLOADED!!!', data); })
  .catch((error) => { console.error(error); });
