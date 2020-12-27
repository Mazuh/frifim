import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    isAuthorized: false,
  },
  reducers: {
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    login: (state) => {
      state.isAuthorized = true;
    },
    logout: (state) => {
      state.isAuthorized = false;
    },
  }
});

export const { logout } = slice.actions;

export const login = () => (dispatch) => {
  dispatch(slice.actions.setLoading(true));
  setTimeout(() => {
    dispatch(slice.actions.login());
    dispatch(slice.actions.setLoading(false));
  }, 1300);
};

export default slice.reducer;
