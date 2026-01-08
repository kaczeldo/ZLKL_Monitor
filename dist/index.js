"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fakeZlklApi_1 = require("./data/fakeZlklApi");
const eventEngine_1 = require("./engines/eventEngine");
const fakeMqttService_1 = require("./services/fakeMqttService");
const sensorStore_1 = require("./store/sensorStore");
const locStore_1 = require("./store/locStore");
async function start() {
    const api = new fakeZlklApi_1.FakeZlklApi();
    console.log("fetching sensors...");
    const data = await api.getSensors();
    const locStore = new locStore_1.LocStore();
    locStore.loadLocations(data.loc);
    const sensorStore = new sensorStore_1.SensorStore();
    // store loaded sensors.
    sensorStore.loadSensors(data.sens, locStore);
    const eventEngine = new eventEngine_1.EventEngine(api);
    const fakeMqtt2 = new fakeMqttService_1.FakeMqttService("someString", "someId", sensorStore, eventEngine);
    const fakeMqtt = new fakeMqttService_1.FakeMqttService("http://192.168.88.46:12345", "zlkl_test_gate", sensorStore, eventEngine);
    fakeMqtt.start();
}
start().catch(err => {
    console.error("Fatal startup error:", err);
});
