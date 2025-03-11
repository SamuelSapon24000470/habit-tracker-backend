import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addHabit } from '../store/habitSlice';
import { styles } from './HabitCard.module.css';

const AddHabit = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && description) {
      dispatch(addHabit({ name, description }));
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del hábito"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Agregar Hábito</button>
    </form>
  );
};

export default AddHabit;
