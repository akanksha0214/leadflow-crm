import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../services/instance";

//login action
export const loginUser = createAsyncThunk('auth/loginUser',
    async ({ email, password }) => {
        const res = await instance.post('/auth/login', { email, password });
        return res.data.user;
    }
)

//load user after refrsh , it helps to store token in backend and not in local storage
export const loadUser = createAsyncThunk('/auth/loadUser',
    async () => {
        const res = await instance.get('/auth/me');
        return res.data.user
    }
)
// export const loadUser = createAsyncThunk(
//     "/auth/loadUser",
//     async (_, { rejectWithValue }) => {
//         try {
//             const res = await instance.get("/auth/me");
//             return res.data;
//         } catch (err) {
//             return rejectWithValue(null);
//         }
//     }
// );

//logout
export const logoutUser = createAsyncThunk('/auth/logoutUser',
    async () => {
        await instance.post('/auth/logout')
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true, // important for initial load
    },

    // reducers = Actions this slice CREATES
    //extraReducers = Actions this slice LISTENS TO
    //Reducers define how state changes.
    //ExtraReducers define how this slice responds to actions it doesn’t own.

    reducers: {}, //reducer is just a function that says:“When this action happens, update the state like this.”
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // load user
            .addCase(loadUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loadUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            // logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export default authSlice.reducer;
