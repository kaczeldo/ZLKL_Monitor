"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const mqttHandlers_1 = require("../mqtt/mqttHandlers");
class MqttService {
    constructor(config, store, evEngine) {
        this.config = config;
        this.store = store;
        this.evEngine = evEngine;
        this.client = mqtt_1.default.connect(this.config.url, {
            username: this.config.username,
            password: this.config.password,
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.client.on("connect", () => {
            console.log("[MQTT] Connected to broker");
        });
        this.client.on("error", (err) => {
            console.error("[MQTT] Connection error:", err);
        });
        this.client.on("message", (topic, payload) => {
            let json;
            try {
                json = JSON.parse(payload.toString());
            }
            catch {
                console.error("[MQTT] Invalid JSON: ", payload.toString());
                return;
            }
            if (topic.startsWith("zlkl/devs/glob/")) {
                const message = json;
                console.log("Received MQTT Glob message.");
                (0, mqttHandlers_1.handleGlobMessage)(message, this.store, this.evEngine);
                return;
            }
            if (topic.startsWith("zlkl/devs/tof/")) {
                const message = json;
                console.log("Received MQTT Tof Event msg.");
                (0, mqttHandlers_1.handleTofEventMessage)(message, this.store, this.evEngine);
                return;
            }
        });
    }
    subscribe(topic) {
        this.client.subscribe(topic, (err) => {
            if (err) {
                console.error("[MQTT] Subscribe error:", err);
            }
            else {
                console.log(`[MQTT] Subscribed to: ${topic}`);
            }
        });
    }
}
exports.MqttService = MqttService;
