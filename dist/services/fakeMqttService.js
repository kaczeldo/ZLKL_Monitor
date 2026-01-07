"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeMqttService = void 0;
const axios_1 = __importDefault(require("axios"));
const mqttHandlers_1 = require("../mqtt/mqttHandlers");
class FakeMqttService {
    constructor(baseUrl, mqttId, store, eventEngine) {
        this.baseUrl = baseUrl;
        this.mqttId = mqttId;
        this.store = store;
        this.eventEngine = eventEngine;
    }
    start() {
        console.log("[FakeMQTT] Starting fake MQTT service");
        this.tofInterval = setInterval(async () => {
            try {
                const res = await axios_1.default.post(`${this.baseUrl}/mqtt/tof/${this.mqttId}`, {
                    state: Math.random() > 0.5 ? 1 : 0,
                });
                (0, mqttHandlers_1.handleTofEventMessage)(res.data, this.store, this.eventEngine);
            }
            catch (err) {
                console.error("[FakeMQTT] TOF error", err);
            }
        }, 3000);
        this.globInterval = setInterval(async () => {
            try {
                const res = await axios_1.default.get(`${this.baseUrl}/mqtt/glob/${this.mqttId}`);
                (0, mqttHandlers_1.handleGlobMessage)(res.data, this.store, this.eventEngine);
            }
            catch (err) {
                console.error("[FakeMQTT] GLOB error", err);
            }
        }, 10000);
    }
    stop() {
        console.log("[FakeMQTT] Stopping fake MQTT service");
        if (this.tofInterval)
            clearInterval(this.tofInterval);
        if (this.globInterval)
            clearInterval(this.globInterval);
    }
}
exports.FakeMqttService = FakeMqttService;
