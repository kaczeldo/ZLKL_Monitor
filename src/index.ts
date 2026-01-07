import "dotenv/config";
import { FakeZlklApi } from "./data/fakeZlklApi";
import { EventEngine } from "./engines/eventEngine";
import { FakeMqttService } from "./services/fakeMqttService";
import { SensorStore } from "./store/sensorStore";
import { LocStore } from "./store/locStore";

async function start() {

  const api = new FakeZlklApi();

  console.log("fetching sensors...");
  const data = await api.getSensors();
  const locStore = new LocStore();
  locStore.loadLocations(data.loc);
  const sensorStore = new SensorStore();
  // store loaded sensors.
  sensorStore.loadSensors(data.sens, locStore);
  const eventEngine = new EventEngine(api);
  const fakeMqtt2 = new FakeMqttService("someString", "someId", sensorStore, eventEngine);
  const fakeMqtt = new FakeMqttService(
    "http://192.168.88.46:12345",
    "zlkl_test_gate",
    sensorStore,
    eventEngine
  );
  
  fakeMqtt.start();
}

start().catch(err => {
  console.error("Fatal startup error:", err);
})
