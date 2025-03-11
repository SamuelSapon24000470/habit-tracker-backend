import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definimos una interfaz para los hábitos
interface Habit {
  _id: string;
  name: string;
  description: string;
  completedDays: number;
}

// Estado inicial con un array de hábitos
interface HabitsState {
  habits: Habit[];
}

const initialState: HabitsState = {
  habits: [],
};

// Creamos el slice
const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    // Acción para establecer los hábitos
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    // Acción para incrementar los días completados
    incrementCompletedDays: (state, action: PayloadAction<string>) => {
      const habit = state.habits.find(h => h._id === action.payload);
      if (habit) {
        habit.completedDays += 1; // Incrementamos los días completados
      }
    },
  },
});

export const { setHabits, incrementCompletedDays } = habitSlice.actions;
export default habitSlice.reducer;
