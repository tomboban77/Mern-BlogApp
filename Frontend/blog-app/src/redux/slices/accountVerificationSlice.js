import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const resetAccountAction = createAction("account/reset");

// Send Mail action
export const accountVerificationSendTokenAction = createAsyncThunk(
  "account/token",
  async (email, { rejectWithValue, getState, dispatch }) => {
    //http call
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const res = await axios.post(
        `${baseUrl}/api/users/generate-verify-token`,
        {},
        config
      );

      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Verify Account action
export const verifyAccountAction = createAsyncThunk(
  "account/verify",
  async (token, { rejectWithValue, getState, dispatch }) => {
    //http call
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    try {
      const res = await axios.put(
        `${baseUrl}/api/users/verify-account`,
        { token },
        config
      );
      dispatch(resetAccountAction());
      return res.data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const accountVerificationSlices = createSlice({
  name: "email",
  initialState: {},
  extraReducers: (builder) => {
    // send mail token
    builder.addCase(
      accountVerificationSendTokenAction.pending,
      (state, action) => {
        state.loading = true;
        state.appErr = undefined;
        state.serverErr = undefined;
      }
    );

    builder.addCase(
      accountVerificationSendTokenAction.fulfilled,
      (state, action) => {
        state.loading = false;
        state.verificationToken = action?.payload;

        state.appErr = undefined;
        state.serverErr = undefined;
      }
    );
    builder.addCase(
      accountVerificationSendTokenAction.rejected,
      (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      }
    );
    // verify account

    builder.addCase(verifyAccountAction.pending, (state, action) => {
      state.loading = true;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(resetAccountAction, (state, action) => {
      state.isVerified = true;
    });

    builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
      state.loading = false;
      state.verifiedAccount = action?.payload;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyAccountAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default accountVerificationSlices.reducer;
