import { configureStore } from '@reduxjs/toolkit';
import habitReducer from './habitSlice'; // Importar el reducer de hábitos

// Crear el store
export const store = configureStore({
  reducer: {
    habits: habitReducer, // Asegúrate de que la clave sea 'habits'
  },
});

// ✅ Exportar tipos para evitar errores en `useDispatch` y `useSelector`
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; // Exportar el store por defecto
