import { createSlice } from "@reduxjs/toolkit";
import iziToast from "izitoast";
import firebaseApp, { googleAuthProvider } from "../../app/firebase-configs";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isAuthorized: false,
    errorCode: '',
    infoMessage: '',
    lastSelectedProjectUuid: '',
  },
  reducers: {
    setAsLoading: (state) => {
      state.user = null;
      state.isLoading = true;
      state.isAuthorized = false;
      state.errorCode = '';
      state.infoMessage = '';
    },
    setAsNotLoading: (state) => {
      state.loading = false;
    },
    setUser: (state, { payload: user }) => {
      state.user = user;
      state.isLoading = false;
      state.isAuthorized = !!user;
      state.errorCode = '';
      state.infoMessage = user ? '' : 'Saiu do sistema.';
    },
    setError: (state, { payload }) => {
      state.user = null;
      state.isAuthorized = false;
      state.isLoading = false;
      state.errorCode = payload;
    },
    clearMessages: (state) => {
      state.errorCode = '';
      state.infoMessage = '';
    },
    setLastSelectedProjectUuid: (state, action) => {
      state.lastSelectedProjectUuid = action.payload;
    },
  }
});

export const { setLastSelectedProjectUuid, clearMessages } = authSlice.actions;

export const login = (email, password) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());

  setTimeout(() => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((credentials) => dispatch(authSlice.actions.setUser(credentials.user.toJSON())))
      .catch(error => dispatch(authSlice.actions.setError(error.code)));
  }, 900);
};

const handlePotentialNewOAuthUser = (credentials) => Promise.all([
  credentials,
  credentials.additionalUserInfo.isNewUser &&
    firebaseApp
      .firestore()
      .collection('projects')
      .add({
        name: 'Principal',
        userUid: credentials.user.uid,
        createdAt: new Date().toISOString(),
      }),
  credentials.additionalUserInfo.isNewUser &&
    credentials.user.sendEmailVerification(),
]);

const postOAuthSingupHandler = (dispatch) => ([credentials, ...responses]) =>
  credentials.user !== null && dispatch(authSlice.actions.setUser(credentials.user.toJSON()));

const defaultErrorHandler = (dispatch) => (error) =>
  dispatch(authSlice.actions.setError(error.code));

export const checkSignInRedirectResult = (options = {}) => (dispatch, getState) => {
  if (getState().auth.user !== null) {
    return;
  }

  if (options.triggerLoading) {
    dispatch(authSlice.actions.setAsLoading());
  }

  firebaseApp
    .auth()
    .getRedirectResult()
    .then(handlePotentialNewOAuthUser)
    .then(postOAuthSingupHandler(dispatch))
    .catch(defaultErrorHandler(dispatch))
    .finally(() => dispatch(authSlice.actions.setAsNotLoading()));
};

export const signInByGoogle = (options = {}) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());

  if (options.signInWithRedirect) {
    firebaseApp.auth().signInWithRedirect(googleAuthProvider);
    return;
  }

  firebaseApp
    .auth()
    .signInWithPopup(googleAuthProvider)
    .then(handlePotentialNewOAuthUser)
    .then(postOAuthSingupHandler(dispatch))
    .catch(defaultErrorHandler(dispatch));
}

export const logout = () => (dispatch) => {
  firebaseApp.auth().signOut();
  dispatch(authSlice.actions.setUser(null));
};

export const signupAndLogin = (email, password, displayName) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());
  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((credentials) => Promise.all([
      credentials,
      credentials
        .user
        .updateProfile({ displayName }),
      credentials
        .user
        .sendEmailVerification(),
      firebaseApp
        .firestore()
        .collection('projects')
        .add({
          name: 'Principal',
          userUid: credentials.user.uid,
          createdAt: new Date().toISOString(),
        }),
    ]))
    .then(([credentials, ...responses]) => dispatch(authSlice.actions.setUser(credentials.user.toJSON())))
    .then(() => iziToast.show({
      title: 'Confirme seu e-mail',
      message: `Enviando link de confirmação para ${email} (cheque a caixa de spam também).`,
      color: 'blue',
      position: 'topCenter',
      timeout: 7000,
    }))
    .catch(defaultErrorHandler);
};

export default authSlice.reducer;
