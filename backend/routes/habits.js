const express = require("express");
const Habit = require("../models/habit");

const router = express.Router();

// Crear un hábito
router.post("/", async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el hábito" });
  }
});

// Obtener todos los hábitos
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los hábitos" });
  }
});

// Eliminar un hábito
router.delete("/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el hábito" });
  }
});

// Actualizar un hábito
router.put("/:id", async (req, res) => {
  try {
    // Si solo quieres incrementar el contador de días, actualizamos solo ese campo
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      { $inc: { completedDays: 1 } }, // Incrementa completedDays en 1
      { new: true } // Devuelve el hábito actualizado
    );
    if (!updatedHabit) {
      return res.status(404).json({ message: "Hábito no encontrado" });
    }
    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el hábito" });
  }
});






  
module.exports = router;
