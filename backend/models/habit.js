const mongoose = require("mongoose");

// Definir el esquema del hábito
const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completedDays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  description: { type: String, default: '' }  // Agregar el campo description
});

// Crear y exportar el modelo
module.exports = mongoose.model("Habit", habitSchema);
