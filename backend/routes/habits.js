const express = require("express");
const Habit = require("../models/habit");
const router = express.Router();
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso no autorizado" });

  try {
    const tokenWithoutBearer = token.replace("Bearer ", ""); // ¡Espacio después de Bearer!
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error("Error al verificar token:", error); // Log detallado
    res.status(401).json({ message: "Token inválido" });
  }
};

// Crear un hábito
router.post("/", authenticateToken, async (req, res) => {
  try {
    const habit = new Habit(req.body);
    await habit.save();
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el hábito" });
  }
});

// Obtener todos los hábitos
router.get("/", authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.find({ owner: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los hábitos" });
  }
});

// Eliminar un hábito
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el hábito" });
  }
});

// Marcar o reiniciar habito
// Helper para calcular diferencia en horas
const timeDifferenceInHours = (date1, date2) => {
  return Math.abs(date1 - date2) / (1000 * 60 * 60);
};

// Marcar hábito como completado
router.patch('/markAsDone/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }

    const now = new Date();
    const hoursSinceLastUpdate = timeDifferenceInHours(now, habit.lastUpdate);

    if (hoursSinceLastUpdate < 24) {
      habit.days += 1;
    } else {
      habit.days = 1; // Reinicia el contador
      
    }

    habit.lastUpdate = now;
    habit.lastDone = now;
    await habit.save();

    // Devuelve el hábito actualizado
    res.status(200).json({
      _id: habit._id,
      name: habit.name,
      days: habit.days,
      lastUpdate: habit.lastUpdate,
      lastDone: habit.lastDone,
    });

  } catch (error) {
    console.error("Error en PATCH /markAsDone:", error); // Log detallado
    res.status(500).json({ error: "Error al actualizar el hábito" });
  }
});
  
module.exports = router;
