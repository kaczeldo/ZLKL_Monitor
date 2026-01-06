import "dotenv/config";
console.log("API URL: ", process.env.ZLKL_API_URL);
import { EventEngine } from "./engines/eventEngine";
import { ThresholdEngine } from "./engines/thresholdEngine";
import { MqttService } from "./services/mqttService";
import { ZlklApi } from "./services/zlklApi";
import { SensorStore } from "./store/sensorStore";
import { config } from "./config";

async function start() {
  if (!process.env.ZLKL_API_URL) {
    throw new Error("ZLKL_API_URL is not set");
  }

  const api = new ZlklApi(config.api);

  console.log("fetching sensors...");
  const data = await api.getSensors();
  console.log("Received ZLKL_API data:");
  console.log(JSON.stringify(data, null, 2));
  const sensorStore = new SensorStore();
  // store loaded sensors.
  sensorStore.loadSensors(data.sens);
  const thresholdEngine = new ThresholdEngine();
  const eventEngine = new EventEngine(api);
  const mqttService = new MqttService(
    config.mqtt,
    sensorStore,
    thresholdEngine,
    eventEngine
  );
  mqttService.subscribe("zlkl/devs/glob/#");
  mqttService.subscribe("zlkl/devs/tof/#");
  console.log("[INIT] Subscribed to MQTT topics.");
}

start().catch(err => {
  console.error("Fatal startup error:", err);
})
