import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const MQTT_BROKER = process.env.MQTT_BROKER || "mqtt://test.mosquitto.org";
//console.log(MQTT_BROKER);

const mqttClient = mqtt.connect(MQTT_BROKER, {
    reconnectPeriod: 3000,
    connectTimeout: 10000,
});

mqttClient.on("connect", () => {
    console.log(`Conectado al broker MQTT en ${MQTT_BROKER}`);
});

mqttClient.on("error", (error) => {
    console.error("MQTT error:", error);
});

mqttClient.on("close", () => {
    console.log("Conexión MQTT cerrada");
});

mqttClient.on("reconnect", () => {
    console.log("Reconectando MQTT...");
});

mqttClient.subscribe("test/topic", (err) => {
    if (err) console.error("Error en subscribe:", err);
    console.log("Suscrito a test/topic");
});

export default mqttClient;

/*
const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("error", (error) => {
    console.log("Hubo un error:", error)
})

client.on("connect", () => {
    client.subscribe("olanga", (err) => {
        if(!err){
            client.publish("olanga", "Hola MQTT :D");
        }
    });
});

client.on("message", (topic, message) => {
    console.log(message.toString());
    client.end();
});

export default client;
*/