import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reservas: [],
  prestadores: [],
  status: 'idle',
  error: null,
};

export const fetchPrestadores = createAsyncThunk('reservas/fetchPrestadores', async () => {
  try {
    const response = await axios.get('http://localhost:1337/api/prestadores?populate=avatar&populate=fondoPerfil');
    return response.data;
  } catch (error) {
    console.error('Error fetching prestadores:', error);
    throw error;
  }
});

export const fetchReservas = createAsyncThunk('reservas/fetchReservas', async () => {
  try {
    const response = await axios.get('http://localhost:1337/api/reservas?filters[comercio][id][$eq]=1&populate[prestador][fields][0]=nombre&populate[comercio][fields][0]=id');
    return response.data;
  } catch (error) {
    console.error('Error fetching reservas:', error);
    throw error;
  }
});

export const createReserva = createAsyncThunk('reservas/createReserva', async ({ nombreCliente, email, fecha, hora, prestador }, { dispatch }) => {
  try {
    const response = await axios.post('http://localhost:1337/api/reservas', {
      data: { nombreCliente, email, fecha, hora, prestador:{id:prestador}, comercio:{id:1} }
    });
    await dispatch(fetchReservas());
    return response.data;
  } catch (error) {
    console.error('Error creating reserva:', error);
    throw error;
  }
});

export const deleteReserva = createAsyncThunk('reservas/deleteReserva', async (id, { dispatch }) => {
  await axios.delete(`http://localhost:1337/api/reservas/${id}`);
  await dispatch(fetchReservas());
  return id;
});


export const registerUser = createAsyncThunk('user/register', async (userData) => {
  try {
    const response = await axios.post('http://localhost:1337/api/auth/local/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
});

export const loginUser = createAsyncThunk('user/login', async (credentials) => {
  try {
    const response = await axios.post('http://localhost:1337/api/auth/local', {
      identifier: credentials.email,
      password: credentials.password,
    });
    // Store the JWT token in localStorage
    localStorage.setItem('token', response.data.jwt);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
});
const removeToken = () => {
  localStorage.removeItem('token');
};
export const logout = createAsyncThunk('user/logout', async () => {
  try {
    removeToken();
    return null;  // Puedes devolver cualquier dato que desees al completar el logout
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
});

const reservasSlice = createSlice({
  name: 'reservas',
  initialState: {
    user: null,
    token: null, // Inicializa el token desde el localStorage al cargar la página
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrestadores.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrestadores.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prestadores = action.payload.data;
      })
      .addCase(fetchPrestadores.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchReservas.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReservas.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reservas = action.payload;
      })
      .addCase(fetchReservas.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReserva.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createReserva.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(createReserva.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteReserva.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteReserva.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deleteReserva.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // You might want to store the user data in your state here
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.jwt;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default reservasSlice.reducer;
