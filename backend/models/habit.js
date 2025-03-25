const mongoose = require("mongoose");
const { type } = require("os");

// Definir el esquema del hábito
const habitSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String, 
    default: '' 
  },  // Agregar el campo description
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  lastDone: {
    type: Date,
    default: Date.now
  },
  completedDays: {
    type: Number,
    default: 0
  },
  days: {
    type: Number,
    default: 1
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
});

// Crear y exportar el modelo
module.exports = mongoose.model("Habit", habitSchema);
