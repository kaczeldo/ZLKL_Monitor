import "dotenv/config";
import { FakeZlklApi } from "./data/fakeZlklApi";
import { EventEngine } from "./engines/eventEngine";
import { FakeMqttService } from "./services/fakeMqttService";
import { SensorStore } from "./store/sensorStore";
import { LocStore } from "./store/locStore";
import { PeriodicCheckEngine } from "./engines/PreiodicCheckEngine";

async function start() {
  // initialize data  - fake for now
  const api = new FakeZlklApi();
  console.log("fetching sensors...");
  const data = await api.getSensors();
  const locStore = new LocStore();
  locStore.loadLocations(data.loc);
  const sensorStore = new SensorStore();
  // store loaded sensors.
  sensorStore.loadSensors(data.sens, locStore);
  console.log(sensorStore);

  // create variables - engines, mqtt, etc.
  const eventEngine = new EventEngine(api);
  const fakeMqtt = new FakeMqttService(
    "http://192.168.88.46:12345",
    "zlkl_test_gate",
    sensorStore,
    eventEngine
  );
   const fakeMqtt2 = new FakeMqttService(
    "http://192.168.88.46:12345",
    "zlkl_test_gate2",
    sensorStore,
    eventEngine
  );
   const fakeMqtt3 = new FakeMqttService(
    "http://192.168.88.46:12345",
    "zlkl_test_gate3",
    sensorStore,
    eventEngine
  );
   const fakeMqtt4 = new FakeMqttService(
    "http://192.168.88.46:12345",
    "zlkl_test_gate4",
    sensorStore,
    eventEngine
  );
  
  // start fake mqtt imitating the tof event and glob messages
  fakeMqtt.start();
  fakeMqtt2.start();
  fakeMqtt3.start();
  fakeMqtt4.start();

  // start periodic check service
  const periodicCheck = new PeriodicCheckEngine(sensorStore, eventEngine);
  periodicCheck.start();
}

start().catch(err => {
  console.error("Fatal startup error:", err);
})