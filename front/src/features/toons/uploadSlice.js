import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api";

const fetchUpload = createAsyncThunk(
  "fetchUpload",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(api.fetchUpload(), data, {});
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadSlice = createSlice({
  name: "upload",
  initialState: {
    webtoonInfo: undefined,
    probability: undefined,
  },
  reducers: {
    cleanResultData: (state, action) => {
      state.webtoonInfo = action.payload;
      state.probability = action.payload;
    },
    fetchProbability: (state, action) => {
      state.probability = action.payload;
    },
  },
  extraReducers: {
    [fetchUpload.fulfilled]: (state, action) => {
      state.webtoonInfo = action.payload;
    },
  },
});

export { fetchUpload };

export const { cleanResultData, fetchProbability } = uploadSlice.actions;

export default uploadSlice.reducer;
