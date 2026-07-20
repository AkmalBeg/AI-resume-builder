import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authslice";
export const store= configureStore({
    reducer:{
        auth:authReducer
    }
});