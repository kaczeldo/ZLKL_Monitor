import { FakeZlklApi } from "../data/fakeZlklApi";
import { DoorState, SensorRuntimeState } from "../models/sensorRuntime";
import { ZlklSensor } from "../models/zlklTypes";
import { ZlklApi } from "../services/zlklApi";

export class EventEngine {
    constructor(private api: FakeZlklApi){}

    public async triggerOpenOrClose(sensor: ZlklSensor, newState: "open" | "closed") {
        /*
        const event = {
            id: sensor.id,
            typ: newState,
            when: Math.floor(Date.now() / 1000),
            sent: 0,
            to: ""
        };

        try{
            await this.api.sendEvent(event);
            console.log(`[EVENT] Sent ${newState.toUpperCase()} event for sensor ID ${sensor.id}`);
        }
        catch(err) {
            console.error(`[EVENT] Failed to sent event for sensor ID ${sensor.id}`, err);
        }
            */
    }
}