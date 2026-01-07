import { DoorRuntimeState } from "../models/sensorRuntime";
import { ZlklSensor } from "../models/zlklTypes";
import { LocStore } from "./locStore";

export class SensorStore {
  private byKey = new Map<string, ZlklSensor>();
  private byId = new Map<number, ZlklSensor>();
  private runtime = new Map<number, DoorRuntimeState>();

  loadSensors(sens: ZlklSensor[], locs: LocStore) {
    this.byKey.clear();
    this.byId.clear();
    this.runtime.clear();

    for (const s of sens) {
      // find the loc of the sensor
      const l = locs.getById(s.misto_id!);
      
      const key = `${s.mqtt_id}::${s.adr}`;
      this.byKey.set(key, s);
      this.byId.set(s.id, s);

      this.runtime.set(s.id, {
        previous_state: null,
        current_state: "closed",
        open_timestamp: null,
        close_timestamp: null,
        open_confirmed: false,
        last_email_timestamp: null,
        // store the tof_prah_min
        tof_prah_min: l?.tof_prah_min
      }

      )
    }
  }

  public getByMqtt(mqttId: string, adr: string): ZlklSensor | undefined {
    return this.byKey.get(`${mqttId}::${adr}`);
  }

  public getById(id: number): ZlklSensor | undefined {
    return this.byId.get(id);
  }

  public getRuntimeState(sensorId: number): DoorRuntimeState | undefined {
    return this.runtime.get(sensorId);
  }

  /*
  public updateSensorValue(sensorId: number, value: number) {
    const rt = this.runtime.get(sensorId);
    if (!rt) return;

    rt.lastValue = value;
    rt.lastUpdate = Date.now();
  }
    */

  public getTofSensorByMqttId(mqttId: string): ZlklSensor | undefined {
    for (const sensor of this.byId.values()) {
      if (sensor.mqtt_id === mqttId && sensor.adr.startsWith("tof")) {
        return sensor;
      }
    }

    return undefined;
  }

  public getAllRuntimeStates() {
    return this.runtime.values();
  }

  public getAllSensors() {
    return this.byId.values();
  }
}
