'use client'; // Importante para que se ejecute en el cliente

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/Styles/stylesc.module.css';
import { setHabits, incrementCompletedDays } from '../store/habitSlice'; // Asegúrate de importar setHabits

export default function HabitsPage() {
  const habits = useSelector((state: any) => state.habits.habits);
  const dispatch = useDispatch();

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // Obtener los hábitos de la API y almacenarlos en Redux
  useEffect(() => {
    fetch('http://localhost:5000/api/habits')
      .then((response) => response.json())
      .then((data) => {
        dispatch(setHabits(data)); // Despacha la acción para almacenar los hábitos en Redux
      })
      .catch((error) => console.error('Error al obtener hábitos:', error));
  }, [dispatch]); // Solo se ejecuta una vez al cargar el componente

  // Función para manejar el clic en "Tarea Completada"
  const handleTaskCompleted = (habitId: string) => {
    dispatch(incrementCompletedDays(habitId)); // Despachamos la acción para actualizar los días completados
  };

  // Función para manejar el envío del formulario
  const handleAddHabit = () => {
    const newHabit = {
      name: newHabitName,
      description: newHabitDescription,
      completedDays: 0,
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

  // Mostrar los hábitos en la interfaz
  return (
    <div className={styles.habitsContainer}>
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
                  width: `${(habit.completedDays / 30) * 100}%`, // Meta de 30 días
                }}
              />
            </div>
            <p>{habit.completedDays} días</p>
            <button
              className={styles.buttontask}
              onClick={() => handleTaskCompleted(habit._id)} // Llama a la función al hacer clic
            >
              Tarea Completada
            </button>
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
