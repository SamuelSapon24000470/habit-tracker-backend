'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { markAsDoneThunk, setHabits } from '../store/habitSlice';
import { fetchLoginUserThunk, fetchRegisterUserThunk} from '../user/userSlice';
import '@/app/globals.css';
import styles from '@/Styles/stylesc.module.css';

export default function HabitsPage() {
  // Estados para autenticación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  // Estados para hábitos
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // Redux
  const habits = useSelector((state: RootState) => state.habits.habits);
  const user = useSelector((state: RootState) => state.user.user);
  const status = useSelector((state: RootState) => state.habits.status);
  const err = useSelector((state: RootState) => state.habits.error);
  const authError = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch<AppDispatch>();

  

  useEffect(() => {
    if (user?.token) {
      fetch('http://localhost:5000/api/habits', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
        .then((response) => response.json())
        .then((data) => dispatch(setHabits(data)))
        .catch((error) => console.error('Error al obtener hábitos:', error));
    }
  }, [user, dispatch]);

  // Handlers para auth
  const handleAuth = async () => {
    console.log("Intentando:", isLoginView ? "Login" : "Register");
    try {
      const action = isLoginView ? fetchLoginUserThunk : fetchRegisterUserThunk;
      const result = await dispatch(action({ username, password }));
      console.log("Resultado:", result);
      
      if (action.fulfilled.match(result)) {
        console.log("Éxito! Token:", result.payload.token);
      } else {
        console.error("Error:", result.payload);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  const handleAddHabit = () => {
    const newHabit = {
      name: newHabitName,
      description: newHabitDescription,
      days: 0,
    };

    fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
      },
      body: JSON.stringify(newHabit),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(setHabits([...habits, data]));
        setNewHabitName('');
        setNewHabitDescription('');
      })
      .catch((error) => console.error('Error al agregar hábito:', error));
  };

  // Mostrar formulario de auth si no hay usuario
  if (!user?.token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-mid max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>
          
          
            {authError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                Error: {authError}
              </div>
            )}

          <div className="mb-4">
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            onClick={handleAuth}
            className={styles.login}
          >
            {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
          <br/>
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className={styles.login}
          >
            {isLoginView ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    );
  }

  // Mostrar hábitos si está autenticado
  return (
    <div className={`p-4 ${styles.habitsContainer}`}>
      <button 
          onClick={() => dispatch({ type: 'user/logout' })}
          className={styles.logout}
        >
          Cerrar Sesión
        </button>
      <div className="flex justify-between items-center mb-6"> 
      
        <h1 className="text-2xl font-bold">Mis Hábitos</h1>
        
      </div>

      {Array.isArray(habits) && habits.length > 0 ? (
        habits.map((habit) => (
          <div key={habit._id} className={styles.habitItem}>
            <h2 className="text-xl font-semibold">{habit.name}</h2>
            <p className="text-gray-600">{habit.description}</p>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${(habit.days / 66) * 100}%`,
                  backgroundColor: habit.days >= 66 ? "#10B981" : habit.days >= 21 ? "#F59E0B" : "#EF4444"
                }}
              />
            </div>
            <p className="text-sm text-gray-500">{habit.days} días</p>
            
              <button
                onClick={() => dispatch(markAsDoneThunk(habit._id))}
                disabled={status[habit._id] === "loading"}
                className={styles.buttontask}
              >
                {status[habit._id] === "loading" ? "Procesando..." : "Tarea Completada"}
              </button>

              {status[habit._id] === "failed" && (
                <span className="text-red-500 text-sm">
                  Error: {err[habit._id] || "No se pudo marcar"}
                </span>
              )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No hay hábitos para mostrar. ¡Agrega tu primer hábito!</p>
      )}

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Hábito</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="Nombre del hábito"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        /><br/>
        <textarea
          className={styles.inputd}
          placeholder="Descripción del hábito"
          value={newHabitDescription}
          onChange={(e) => setNewHabitDescription(e.target.value)}
        /><br/>
        <button 
          onClick={handleAddHabit} 
          className={styles.addHabitBtn}
          disabled={!newHabitName.trim()}
        >
          Agregar Hábito
        </button>
      </div>
    </div>
  );
}