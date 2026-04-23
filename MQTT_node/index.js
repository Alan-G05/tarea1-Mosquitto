import express from "express";
import dotenv from "dotenv";
import mqttClient from "./lib/configMQTT.js";

import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "Hola" })
});

app.delete("/subscribe", (req, res) => {
    mqttClient.end();
    return res.status(200).json({ message: "Conexion MQTT cerrada" })
})

mqttClient.on("message", (topic, message) => {
    try {
        const datos = JSON.parse(message.toString());
        console.log(`El mensaje en el topic ${topic} es ${message.toString()}`);

        io.emit("mqtt-data", datos);
    } catch (error) {
        console.log("Error al pasar los datos a JSON:", error);
    }

    //mqttClient.end();
});

app.post("/publisher", (req, res) => {
    const { message } = req.body;

    try {
        console.log("Mensaje recibido del cliente:", message);
        mqttClient.publish("test/topic", message);
        res.status(200).json({ message: "Publicado" });
    } catch (error) {
        console.log("Error en publish:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

httpServer.listen(PORT, () => {
    console.log("Servidor ejecutandose en http://localhost:"+PORT);
})