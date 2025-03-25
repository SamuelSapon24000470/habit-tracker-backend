require('./config/database');

var express = require('express');
const cors = require('cors'); // Asegúrate de importar cors

var app = express(); // Inicializa la app aquí

app.use(cors());

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Habilitar CORS para todos los orígenes

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const habitRoutes = require("./routes/habits");
app.use("/api/habits", habitRoutes);

const PORT = process.env.PORT || 5000;  // Puerto por defecto 5000 si no está configurado en .env
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
