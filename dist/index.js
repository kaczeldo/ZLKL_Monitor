"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fakeZlklApi_1 = require("./data/fakeZlklApi");
const eventEngine_1 = require("./engines/eventEngine");
const fakeMqttService_1 = require("./services/fakeMqttService");
const sensorStore_1 = require("./store/sensorStore");
const locStore_1 = require("./store/locStore");
const PreiodicCheckEngine_1 = require("./engines/PreiodicCheckEngine");
async function start() {
    // initialize data  - fake for now
    const api = new fakeZlklApi_1.FakeZlklApi();
    console.log("fetching sensors...");
    const data = await api.getSensors();
    const locStore = new locStore_1.LocStore();
    locStore.loadLocations(data.loc);
    const sensorStore = new sensorStore_1.SensorStore();
    // store loaded sensors.
    sensorStore.loadSensors(data.sens, locStore);
    console.log(sensorStore);
    // create variables - engines, mqtt, etc.
    const eventEngine = new eventEngine_1.EventEngine(api);
    const fakeMqtt = new fakeMqttService_1.FakeMqttService("http://192.168.88.46:12345", "zlkl_test_gate", sensorStore, eventEngine);
    const fakeMqtt2 = new fakeMqttService_1.FakeMqttService("http://192.168.88.46:12345", "zlkl_test_gate2", sensorStore, eventEngine);
    const fakeMqtt3 = new fakeMqttService_1.FakeMqttService("http://192.168.88.46:12345", "zlkl_test_gate3", sensorStore, eventEngine);
    const fakeMqtt4 = new fakeMqttService_1.FakeMqttService("http://192.168.88.46:12345", "zlkl_test_gate4", sensorStore, eventEngine);
    // start fake mqtt imitating the tof event and glob messages
    fakeMqtt.start();
    fakeMqtt2.start();
    fakeMqtt3.start();
    fakeMqtt4.start();
    // start periodic check service
    const periodicCheck = new PreiodicCheckEngine_1.PeriodicCheckEngine(sensorStore, eventEngine);
    periodicCheck.start();
}
start().catch(err => {
    console.error("Fatal startup error:", err);
});
