"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicCheckEngine = void 0;
class PeriodicCheckEngine {
    constructor(store, eventEngine) {
        this.store = store;
        this.eventEngine = eventEngine;
    }
    start() {
        if (this.timer)
            return; // prevent double start
        this.timer = setInterval(() => {
            this.run();
        }, 10000);
        console.log("[PERIODIC_CHECK] Started successfully");
    }
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        console.log("[PERIODIC_CHECK] Stopped successfully");
    }
    run() {
        const sensors = this.store.getAllSensors();
        for (const s of sensors) {
            const rs = this.store.getRuntimeState(s.id);
            if (!rs)
                continue;
            if (rs.current_state === "open") { // check only opened doors now
                if (!rs.open_timestamp)
                    continue; // if there is missing open timestamp, skip
                if (rs.open_confirmed)
                    continue; // if mail was already sent, skip
                // now we know the state is as it should be, calculate duration
                rs.duration = Date.now() - rs.open_timestamp;
                // compare duration to threshold
                const th_in_ml = rs.tof_prah_min * 60 * 1000;
                if (rs.duration >= th_in_ml) {
                    // sent out emails
                    console.log(`[PERIODIC_CHECK] ${s.id}: Triggering event.`);
                    this.eventEngine.triggerOpenOrClose(s, rs.current_state);
                    // set open confirm
                    rs.open_confirmed = true;
                    rs.last_email_timestamp = Date.now();
                }
                else { // do nothing
                    console.log(`[PERIODIC_CHECK] ${s.id}: Threshold not satisfied: druation = ${rs.duration}, threshold = ${th_in_ml}`);
                }
            }
            else if (rs.current_state === "closed") {
                // logic for closed
            }
        }
    }
}
exports.PeriodicCheckEngine = PeriodicCheckEngine;
