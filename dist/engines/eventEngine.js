"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEngine = void 0;
class EventEngine {
    constructor(api) {
        this.api = api;
    }
    async triggerOpenOrClose(sensor, newState) {
        const event = {
            id: sensor.id,
            typ: newState,
            when: Math.floor(Date.now() / 1000),
            sent: 0,
            to: ""
        };
        try {
            await this.api.sendEvent(event);
            console.log(`[EVENT] Sent ${newState.toUpperCase()} event for sensor ID ${sensor.id}`);
        }
        catch (err) {
            console.error(`[EVENT] Failed to sent event for sensor ID ${sensor.id}`, err);
        }
    }
}
exports.EventEngine = EventEngine;
