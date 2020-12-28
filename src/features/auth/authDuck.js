import { createSlice } from "@reduxjs/toolkit";
import firebaseApp from "../../app/firebase-configs";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isAuthorized: false,
    errorCode: '',
    infoMessage: '',
  },
  reducers: {
    setAsLoading: (state) => {
      state.user = null;
      state.isLoading = true;
      state.isAuthorized = false;
      state.errorCode = '';
      state.infoMessage = '';
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
  }
});

firebaseApp.auth().onAuthStateChanged((user) => authSlice.actions.setUser(user ? user.toJSON() : null));

export const { clearMessages } = authSlice.actions;

export const login = (email, password) => (dispatch) => {
  dispatch(authSlice.actions.setAsLoading());
  setTimeout(() => {
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((credentials) => dispatch(authSlice.actions.setUser(credentials.user.toJSON())))
      .catch(error => dispatch(authSlice.actions.setError(error.code)));
  }, 1000);
};

export const logout = () => (dispatch) => {
  firebaseApp.auth().signOut();
  dispatch(authSlice.actions.setUser(null));
};

export default authSlice.reducer;
