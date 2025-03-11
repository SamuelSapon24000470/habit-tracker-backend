import { configureStore } from '@reduxjs/toolkit';
import habitReducer from './habitSlice'; // Importar el reducer de hábitos

// Crear el store
const store = configureStore({
  reducer: {
    habits: habitReducer, // Asegúrate de que la clave sea 'habits'
  },
});

export default store;
