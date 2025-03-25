import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Definimos una interfaz para los hábitos
interface Habit {
  _id: string;
  name: string;
  description: string;
  completedDays: number;
  days: number;
  lastDone: Date;
  lastUpdated: Date;
  startedAt: Date;
}

// Estado inicial con un array de hábitos
interface HabitsState {
  habits: Habit[];
  status: Record<string, "idle" | "loading" | "success" | "failed">;
  error: Record<string, string | null>;
}

const initialState: HabitsState = {
  habits: [],
  status: {},
  error: {},
};

export const markAsDoneThunk = createAsyncThunk(
  "habits/markAsDone",
  async (habitId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/habits/markAsDone/${habitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // ← Añade headers
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Usa el mensaje de error del backend o uno por defecto
        return rejectWithValue(data.error || "Error al actualizar el hábito");
      }

      return data; // Devuelve el hábito actualizado

    } catch (error) {
      return rejectWithValue("Error de conexión con el servidor");
    }
  }
);

// Creamos el slice
const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      console.log("Actualizando hábitos en Redux:", action.payload); // ← Añade esto
      state.habits = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAsDoneThunk.pending, (state, action) => {
        state.status[action.meta.arg] = "loading";
      })
      .addCase(markAsDoneThunk.fulfilled, (state, action) => {
        state.habits = state.habits.map(habit => 
          habit._id === action.payload._id ? action.payload : habit
        );
        state.status[action.meta.arg] = "success";
      })
      .addCase(markAsDoneThunk.rejected, (state, action) => {
        state.status[action.meta.arg] = "failed";
        state.error[action.meta.arg] = action.payload as string;
      });
  }
});

export const { setHabits } = habitSlice.actions;
export default habitSlice.reducer;
