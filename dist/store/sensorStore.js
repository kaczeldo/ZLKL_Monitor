"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorStore = void 0;
class SensorStore {
    constructor() {
        this.byKey = new Map();
        this.byId = new Map();
        this.runtime = new Map();
    }
    loadSensors(sens) {
        this.byKey.clear();
        this.byId.clear();
        this.runtime.clear();
        for (const s of sens) {
            const key = `${s.mqtt_id}::${s.adr}`;
            this.byKey.set(key, s);
            this.byId.set(s.id, s);
            this.runtime.set(s.id, {
                id: s.id,
                lastValue: null,
                lastUpdate: null,
                state: "unknown",
            });
        }
    }
    getByMqtt(mqttId, adr) {
        return this.byKey.get(`${mqttId}::${adr}`);
    }
    getById(id) {
        return this.byId.get(id);
    }
    getRuntimeState(sensorId) {
        return this.runtime.get(sensorId);
    }
    updateSensorValue(sensorId, value) {
        const rt = this.runtime.get(sensorId);
        if (!rt)
            return;
        rt.lastValue = value;
        rt.lastUpdate = Date.now();
    }
    getTofSensorByMqttId(mqttId) {
        for (const sensor of this.byId.values()) {
            if (sensor.mqtt_id === mqttId && sensor.adr.startsWith("tof")) {
                return sensor;
            }
        }
        return undefined;
    }
}
exports.SensorStore = SensorStore;
