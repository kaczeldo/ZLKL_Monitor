import axios from "axios";
import { handleGlobMessage, handleTofEventMessage } from "../mqtt/mqttHandlers";
import { SensorStore } from "../store/sensorStore";
import { EventEngine } from "../engines/eventEngine";

export class FakeMqttService {
    private tofInterval?: NodeJS.Timeout;
    private globInterval?: NodeJS.Timeout;

    constructor(
        private baseUrl: string,
        private mqttId: string,
        private store: SensorStore,
        private eventEngine: EventEngine
    ) {}

    start () {
        console.log("[FakeMQTT] Starting fake MQTT service");

        this.tofInterval = setInterval(async () => {
            try {
                const res = await axios.post(
                    `${this.baseUrl}/mqtt/tof/${this.mqttId}`,
                    {
                        state: Math.random() > 0.5 ? 1 : 0,
                    }
                );

                handleTofEventMessage(res.data, this.store, this.eventEngine);
            } catch(err) {
                console.error("[FakeMQTT] TOF error", err);
            }
        }, 3000);

        this.globInterval = setInterval(async () => {
            try {
                const res = await axios.get(
                    `${this.baseUrl}/mqtt/glob/${this.mqttId}`
                );

                handleGlobMessage(
                    res.data,
                    this.store,
                    this.eventEngine
                );
            } catch(err) {
                console.error("[FakeMQTT] GLOB error", err);
            }
        }, 10000);
    }

    stop() {
        console.log("[FakeMQTT] Stopping fake MQTT service");

        if (this.tofInterval) clearInterval(this.tofInterval);
        if (this.globInterval) clearInterval(this.globInterval);
    }
}