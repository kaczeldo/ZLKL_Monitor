"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
console.log("API URL: ", process.env.ZLKL_API_URL);
const eventEngine_1 = require("./engines/eventEngine");
const thresholdEngine_1 = require("./engines/thresholdEngine");
const mqttService_1 = require("./services/mqttService");
const zlklApi_1 = require("./services/zlklApi");
const sensorStore_1 = require("./store/sensorStore");
const config_1 = require("./config");
async function start() {
    if (!process.env.ZLKL_API_URL) {
        throw new Error("ZLKL_API_URL is not set");
    }
    const api = new zlklApi_1.ZlklApi(config_1.config.api);
    console.log("fetching sensors...");
    const data = await api.getSensors();
    console.log("Received ZLKL_API data:");
    console.log(JSON.stringify(data, null, 2));
    const sensorStore = new sensorStore_1.SensorStore();
    // store loaded sensors.
    sensorStore.loadSensors(data.sens);
    const thresholdEngine = new thresholdEngine_1.ThresholdEngine();
    const eventEngine = new eventEngine_1.EventEngine(api);
    const mqttService = new mqttService_1.MqttService(config_1.config.mqtt, sensorStore, thresholdEngine, eventEngine);
    mqttService.subscribe("zlkl/devs/glob/#");
    mqttService.subscribe("zlkl/devs/tof/#");
    console.log("[INIT] Subscribed to MQTT topics.");
}
start().catch(err => {
    console.error("Fatal startup error:", err);
});
