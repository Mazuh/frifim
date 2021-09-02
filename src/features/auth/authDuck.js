import { createSlice } from '@reduxjs/toolkit';
import iziToast from 'izitoast';
import firebaseApp, {
  googleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from '../../app/firebase-configs';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isAuthorized: false,
    isVerificationLinkSent: false,
    errorCode: '',
    infoMessage: '',
    lastSelectedProjectUuid: '',
  },
  reducers: {
    setAsLoading: (state) => {
      state.user = null;
      state.isLoading = true;
      state.isAuthorized = false;
      state.isVerificationLinkSent = false;
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
      state.isVerificationLinkSent = false;
    },
    setUserDisplayName: (state, { payload: displayName }) => {
      state.user.displayName = displayName;
    },
    setError: (state, { payload }) => {
      state.user = null;
      state.isAuthorized = false;
      state.isLoading = false;
      state.errorCode = payload;
    },
    expireSession: (state) => {
      state.user = null;
      state.isAuthorized = false;
      state.isLoading = false;
      state.infoMessage = 'Você saiu ou a sessão expirou.';
      state.isVerificationLinkSent = false;
    },
    clearMessages: (state) => {
      state.errorCode = '';
      state.infoMessage = '';
    },
    setLastSelectedProjectUuid: (state, action) => {
      state.lastSelectedProjectUuid = action.payload;
    },
    setVerificationLinkSent: (state, action) => {
      state.isVerificationLinkSent = action.payload;
    },
  },
});

export const { setLastSelectedProjectUuid, clearMessages } = authSlice.actions;

export const authPlainActions = authSlice.actions;

export const login = (email, password) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());

  signInWithEmailAndPassword(email, password)
    .then((credentials) => dispatch(authSlice.actions.setUser(credentials.user.toJSON())))
    .catch((error) => dispatch(authSlice.actions.setError(error.code)));
};

const handlePotentialNewOAuthUser = (credentials) =>
  Promise.all([
    credentials,
    credentials.additionalUserInfo.isNewUser &&
      firebaseApp.firestore().collection('projects').add({
        name: 'Principal',
        userUid: credentials.user.uid,
        createdAt: new Date().toISOString(),
      }),
    credentials.additionalUserInfo.isNewUser && credentials.user.sendEmailVerification(),
  ]);

const postOAuthSingupHandler =
  (dispatch) =>
  ([credentials, ...responses]) =>
    credentials.user !== null && dispatch(authSlice.actions.setUser(credentials.user.toJSON()));

const defaultErrorHandler = (dispatch) => (error) =>
  dispatch(authSlice.actions.setError(error.code));

export const checkSignInRedirectResult =
  (options = {}) =>
  (dispatch, getState) => {
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

export const signInByGoogle =
  (options = {}) =>
  (dispatch) => {
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
  };

export const logout = () => (dispatch) => {
  firebaseApp.auth().signOut();
  dispatch(authSlice.actions.setUser(null));
};

export const expireSession = () => (dispatch, getState) => {
  if (!getState().auth.user) {
    return;
  }

  firebaseApp.auth().signOut();
  dispatch(authSlice.actions.expireSession());
};

export const signupAndLogin = (email, password, displayName) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());
  firebaseApp
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((credentials) =>
      Promise.all([
        credentials,
        credentials.user.updateProfile({ displayName }),
        credentials.user.sendEmailVerification(),
        firebaseApp.firestore().collection('projects').add({
          name: 'Principal',
          userUid: credentials.user.uid,
          createdAt: new Date().toISOString(),
        }),
      ])
    )
    .then(([credentials, ...responses]) =>
      dispatch(authSlice.actions.setUser(credentials.user.toJSON()))
    )
    .then(() =>
      iziToast.show({
        title: 'Verificação',
        message: `Enviado e-mail de verificação para ${email} (cheque a caixa de spam também).`,
        color: 'blue',
        position: 'topCenter',
        timeout: 7000,
      })
    )
    .then(() => dispatch(authSlice.actions.setVerificationLinkSent(true)))
    .catch(defaultErrorHandler);
};

export const updateDisplayName =
  (displayName, onFinally = () => {}) =>
  (dispatch) =>
    firebaseApp
      .auth()
      .currentUser.updateProfile({ displayName })
      .then(() => dispatch(authSlice.actions.setUserDisplayName(displayName)))
      .finally(onFinally);

export const sendVerificationLink = () => (dispatch) =>
  sendEmailVerification()
    .then(() => dispatch(authSlice.actions.setVerificationLinkSent(true)))
    .then(() =>
      iziToast.show({
        title: 'Verificação',
        message: 'E-mail de verificação enviado (lembre de checar sua caixa de spam).',
        color: 'blue',
        position: 'topCenter',
        timeout: 2000,
      })
    )
    .catch((error) => {
      console.error('Error on sending verification link', error);
      iziToast.show({
        title: 'Verificação',
        message: 'Não enviou link de verificação, tente novamente mais tarde.',
        color: 'red',
        position: 'topCenter',
        timeout: 6000,
      });
    });

export default authSlice.reducer;
