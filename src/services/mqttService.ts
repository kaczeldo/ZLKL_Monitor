import mqtt, { MqttClient } from "mqtt";
import { MqttGlobMessage, MqttTofEventMessage } from "../models/mqttTypes";
import { handleGlobMessage, handleTofEventMessage } from "../mqtt/mqttHandlers";
import { SensorStore } from "../store/sensorStore";
import { EventEngine } from "../engines/eventEngine";

export interface MqttConfig {
  url: string;
  username?: string;
  password?: string;
}

export class MqttService {
  private client: MqttClient;

  constructor(private config: MqttConfig, private store: SensorStore, private evEngine: EventEngine) {
    this.client = mqtt.connect(this.config.url, {
      username: this.config.username,
      password: this.config.password,
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    this.client.on("connect", () => {
      console.log("[MQTT] Connected to broker");
    });

    this.client.on("error", (err) => {
      console.error("[MQTT] Connection error:", err);
    });

    this.client.on("message", (topic, payload) => {
      let json: any;

      try {
        json = JSON.parse(payload.toString());
      } catch {
        console.error("[MQTT] Invalid JSON: ", payload.toString());
        return;
      }

      if (topic.startsWith("zlkl/devs/glob/")) {
        const message = json as MqttGlobMessage;
        console.log("Received MQTT Glob message.");
        handleGlobMessage(message, this.store, this.evEngine);
        return;
      }

      if (topic.startsWith("zlkl/devs/tof/")) {
        const message = json as MqttTofEventMessage;
        console.log("Received MQTT Tof Event msg.");
        handleTofEventMessage(message, this.store, this.evEngine);
        return;
      }
    });
  }

  public subscribe(topic: string) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error("[MQTT] Subscribe error:", err);
      } else {
        console.log(`[MQTT] Subscribed to: ${topic}`);
      }
    });
  }
}
