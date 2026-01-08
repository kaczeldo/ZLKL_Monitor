import { SensorStore } from "../store/sensorStore";
import { EventEngine } from "./eventEngine";

export class PeriodicCheckEngine {
    constructor(
        private store: SensorStore,
        private eventEngine: EventEngine
    ) { }

    private timer?: NodeJS.Timeout;

    start() {
        if (this.timer) return; // prevent double start
        this.timer = setInterval(() => {
            this.run();
        }, 10_000);
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    run() {
        // todo
        /**
         * Each 10 seconds go through each sensor and check runtime state.
         * We are looking for:
         * 1/ opened doors which did not crossed the threshold -> do nothing
         * 2/ opened doors which did crossed the threshold -> send email and change status
         * 3/ closed doors which ???
         */
        const sensors = this.store.getAllSensors();
        for (const s of sensors) {
            const rs = this.store.getRuntimeState(s.id);
            if (!rs) continue;
            if (rs.current_state === "open") {// check only opened doors now
                if (!rs.open_timestamp) continue; // if there is missing open timestamp, skip
                if (rs.open_confirmed) continue; // if mail was already sent, skip
                // now we know the state is as it should be, calculate duration
                rs.duration = Date.now() - rs.open_timestamp;
                // compare duration to threshold
                const th_in_ml = rs.tof_prah_min! * 60 * 1000;
                if (rs.duration >= th_in_ml){
                    // sent out emails
                    this.eventEngine.triggerOpenOrClose(s, rs.current_state);
                    // set open confirm
                    rs.open_confirmed = true;
                    rs.last_email_timestamp = Date.now();            
                } else { // do nothing

                }
            }else if (rs.current_state === "closed"){
                // logic for closed
            }

        }
    }

}