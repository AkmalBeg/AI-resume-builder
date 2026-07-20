import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading:true
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout: (state, action) => {
            state.token = "";
            state.user = null;
            localStorage.removeItem("token");
        },

        setloading: (state, action) => {
state.loading = action.payload;
    }
}
});

export const { login, logout, setloading } = authSlice.actions;
export default authSlice.reducer;