import styles from './HabitCard.module.css';

const HabitCard = ({ habit }) => {
  const handleMarkCompleted = () => {
    dispatch(markHabitCompleted(habit._id));
  };

  return (
    <div className={styles.habitCard}>
      <h3>{habit.name}</h3>
      <p>{habit.description}</p>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${(habit.completedDays / habit.totalDays) * 100}%` }}
        ></div>
      </div>
      <button onClick={handleMarkCompleted}>Marcar como completado</button>
    </div>
  );
};

export default HabitCard;
