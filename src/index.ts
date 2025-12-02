import { EventEngine } from "./engines/eventEngine";
import { ThresholdEngine } from "./engines/thresholdEngine";
import { MqttService } from "./services/mqttService";
import { ZlklApi } from "./services/zlklApi";
import { SensorStore } from "./store/sensorStore";

async function start() {
  const api = new ZlklApi({
    baseUrl: "https://example.com/api",
    apiName: "tof_node_api",
    apiKey: "FAKE_KEY",
  });

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
    {
      url: "test",
      username: "test",
      password: "test",
    },
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
