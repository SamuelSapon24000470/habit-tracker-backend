import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchRegisterUser, fetchLoginUser } from "./userAPI";
import { create } from "domain";

interface UserCredentials {
    username: string;
    password: string;
  }
  
  type User = {
    token: string;
  };
  
  type UserState = {
    user: User | null;
    status: "idle" | "loading" | "success" | "failed";
    error: string | null;
  };

  const initialState: UserState = {
    user: null,
    status: "idle",
    error: null,
  };

// Thunk de registro
export const fetchRegisterUserThunk = createAsyncThunk(
    'user/register',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:5000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          return rejectWithValue(data.message || "Error al registrar");
        }
        return data;
      } catch (error: any) {
        return rejectWithValue(error.message || "Error de conexión");
      }
    }
  );

// Thunk de login
export const fetchLoginUserThunk = createAsyncThunk(
    'user/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
      try {
        const response = await fetch('http://localhost:5000/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          return rejectWithValue(data.message || "Credenciales inválidas");
        }
        return { token: data.token }; // Asegúrate que el backend devuelva un token
      } catch (error: any) {
        return rejectWithValue(error.message || "Error de conexión");
      }
    }
  );

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      addUser: (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      },
        logout: (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
  }
    },
    extraReducers: (builder) => {
      builder
        // Registro
        .addCase(fetchRegisterUserThunk.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchRegisterUserThunk.fulfilled, (state) => {
          state.status = "success";
          state.error = null;
        })
        .addCase(fetchRegisterUserThunk.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload as string;
        })
        
        // Login
        .addCase(fetchLoginUserThunk.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchLoginUserThunk.fulfilled, (state, action) => {
          state.status = "success";
          state.user = action.payload;
          state.error = null;
        })
        .addCase(fetchLoginUserThunk.rejected, (state, action) => {
          state.status = "failed";
          state.user = null;
          state.error = action.payload as string;
        });
    }
  });
  
export const { addUser, logout } = userSlice.actions;
export default userSlice.reducer;


