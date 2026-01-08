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
        const randomTime = Math.floor(Math.random() * (12000 - 4000)) + 4000;
        const randomTimeGlob = Math.floor(Math.random() * (60000 - 30000)) + 30000;

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
        }, randomTime);

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
        }, randomTimeGlob);
    }

    stop() {
        console.log("[FakeMQTT] Stopping fake MQTT service");

        if (this.tofInterval) clearInterval(this.tofInterval);
        if (this.globInterval) clearInterval(this.globInterval);
    }
}