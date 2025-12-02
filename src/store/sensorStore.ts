import { SensorRuntimeState } from "../models/sensorRuntime";
import { ZlklSensor } from "../models/zlklTypes";

export class SensorStore {
  private byKey = new Map<string, ZlklSensor>();
  private byId = new Map<number, ZlklSensor>();
  private runtime = new Map<number, SensorRuntimeState>();

  loadSensors(sens: ZlklSensor[]) {
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

  public getByMqtt(mqttId: string, adr: string): ZlklSensor | undefined {
    return this.byKey.get(`${mqttId}::${adr}`);
  }

  public getById(id: number): ZlklSensor | undefined {
    return this.byId.get(id);
  }

  public getRuntimeState(sensorId: number): SensorRuntimeState | undefined {
    return this.runtime.get(sensorId);
  }

  public updateSensorValue(sensorId: number, value: number) {
    const rt = this.runtime.get(sensorId);
    if (!rt) return;

    rt.lastValue = value;
    rt.lastUpdate = Date.now();
  }

  public getTofSensorByMqttId(mqttId: string): ZlklSensor | undefined {
    for (const sensor of this.byId.values()) {
      if (sensor.mqtt_id === mqttId && sensor.adr.startsWith("tof")) {
        return sensor;
      }
    }

    return undefined;
  }
}
