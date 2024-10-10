const express = require("express");
const mongoose = require("mongoose");
const { config } = require("dotenv");
const bodyParser = require("body-parser");
const pizzeriaRoutes = require("./rutas/pizzeria.ruta");
config();

const app = express();
app.use(bodyParser.json());

// Conectamos a la base de datos
mongoose.connect(process.env.MONGO_URI, {dbName: process.env.MONGO_DB_NOMBRE})
const db = mongoose.connection;

app.use("/usuarios", pizzeriaRoutes);
    

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
})