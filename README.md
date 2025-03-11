# Habit Tracker Backend

## Descripción
Este es un proyecto de backend para una aplicación web de seguimiento de hábitos. Los usuarios pueden crear cuentas, agregar hábitos y marcar si los han completado diariamente. Los hábitos se gestionan mediante una API REST utilizando Express.js, MongoDB y Mongoose.

## Tecnologías utilizadas
- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para crear la API REST.
- **MongoDB**: Base de datos NoSQL.
- **Mongoose**: ODM (Object Data Modeling) para interactuar con MongoDB.
- **Postman**: Herramienta para probar las APIs.

## Instalación

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/SamuelSapon24000470/habit-tracker-backend.git
2. Navega a la carpeta del proyecto:
      cd habit-tracker-backend
3. Instala las dependencias:
      npm install
4. Crea un archivo .env en la raíz del proyecto con las variables necesarias para la conexión a la base de datos y otras configuraciones:
      MONGO_URI=mongodb+srv://<tu_usuario>:<tu_contraseña>@cluster0.mongodb.net/habit-tracker
      PORT=5000


## Ejecutar el Proyecto

1. Para ejecutar el backend en tu máquina local, usa el siguiente comando:
      npm run dev
2. Esto levantará el servidor en el puerto especificado (por defecto, 5000), y podrás probar las rutas de la API utilizando Postman o cualquier otra herramienta de tu preferencia.

## Endpoints

- Obtener todos los hábitos
      GET /api/habits
         Obtiene todos los hábitos almacenados en la base de datos.
- Crear un nuevo hábito
      POST /api/habits
- Crea un nuevo hábito.
      Body:
         {
         "name": "Nombre del hábito",
         "description": "Descripción del hábito"
         }

## Marcar un hábito como completado

- PUT /api/habits/:id/complete
      * Actualiza los días completados de un hábito.
      * Params:
         id: ID del hábito a actualizar.



