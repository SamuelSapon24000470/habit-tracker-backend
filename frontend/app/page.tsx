'use client'; // Importante para que se ejecute en el cliente

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store"; // IMPORTANTE
import { markAsDoneThunk, setHabits } from '../store/habitSlice';
import '@/app/globals.css';  // Asegúrate de que este archivo esté importado.
import styles from '@/Styles/stylesc.module.css';  // Esto se mantiene como está.

export default function HabitsPage() {
  const habits = useSelector((state: RootState) => {
    console.log("Estado actual de Redux:", state.habits); // ← Añade esto
    return state.habits.habits;
  });
  const dispatch = useDispatch<AppDispatch>(); // Tipar correctamente `dispatch`

  const status = useSelector((state: RootState) => state.habits.status); // Tipado
  const err = useSelector((state: RootState) => state.habits.error); // Tipado

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // Obtener los hábitos de la API y almacenarlos en Redux
  useEffect(() => {
    fetch('http://localhost:5000/api/habits')
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos del backend:", data); // ← ¡Añade esto!
        dispatch(setHabits(data));
      })
      .catch((error) => console.error('Error al obtener hábitos:', error));
  }, [dispatch]);

  // Función para manejar el envío del formulario
  const handleAddHabit = () => {
    const newHabit = {
      name: newHabitName,
      description: newHabitDescription,
      days: 0,  // Aquí inicializas completedDays en 0
    };

    // Enviar el nuevo hábito al backend
    fetch('http://localhost:5000/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHabit),
    })
      .then((response) => response.json())
      .then((data) => {
        // Actualizamos los hábitos con el nuevo hábito
        dispatch(setHabits([...habits, data])); // Despachamos la acción para agregar el hábito a Redux
        setNewHabitName('');
        setNewHabitDescription('');
      })
      .catch((error) => console.error('Error al agregar hábito:', error));
  };

  // Función para marcar como hecho
  const handleMarkAsDone = (habitId: string) => {
    dispatch(markAsDoneThunk(habitId)); // Despachamos la acción para marcar el hábito como completado
  };

  // Mostrar los hábitos en la interfaz
  return (
    
    <div className={`p-4 ${styles.habitsContainer}`}>
      <h1>Mis Hábitos</h1>
      {Array.isArray(habits) && habits.length > 0 ? (
  habits.map((habit) => (
    <div key={habit._id} className={styles.habitItem}>
      <h2>{habit.name}</h2>
      <p>{habit.description}</p>
      <div className={styles.progressBarContainer}>
  <div
    className={styles.progressBar}
    style={{
      width: `${(habit.days / 66) * 100}%`, // Usa completedDays aquí
       //backgroundColor: habit.days >= 66 ? "green" : habit.days >= 20 ? "yellow" : "red"
    }}
  />
</div>

      <p>{habit.days} días</p>
      <button
        className={styles.buttontask}
        onClick={() => dispatch(markAsDoneThunk(habit._id))}
      >
        {status[habit._id] === "loading" ? "Processing" : "Tarea Completada"}
      </button>
      {status[habit._id] === "failed" && <span >{err[habit._id]}</span>}
      {status[habit._id] === "success" && <span >Tarea marcada como completada</span>}
    </div>
  ))
) : (
  <p>No hay hábitos para mostrar.</p>
)}


      {/* Formulario para agregar un nuevo hábito */}
      <h2>Agregar Nuevo Hábito</h2>
      <input
        className={styles.input}
        type="text"
        placeholder="Nombre del hábito"
        value={newHabitName}
        onChange={(e) => setNewHabitName(e.target.value)}
      />
      <textarea
        className={styles.inputd}
        placeholder="Descripción del hábito"
        value={newHabitDescription}
        onChange={(e) => setNewHabitDescription(e.target.value)}
      />
      <button onClick={handleAddHabit} className={styles.addHabitBtn}>
        Agregar Hábito
      </button>
    </div>
  );
}
