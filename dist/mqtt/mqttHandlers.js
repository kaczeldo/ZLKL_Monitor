"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobMessage = handleGlobMessage;
exports.handleTofEventMessage = handleTofEventMessage;
function handleGlobMessage(msg, store, eventEngine) {
    console.log(`[GLOB] Received glob event.`);
    for (const s of msg.t) {
        const currSensor = store.getByMqtt(msg.id, s.addr);
        if (!currSensor)
            continue;
        const runtime = store.getRuntimeState(currSensor.id);
        if (!runtime)
            continue;
        const globState = s.val === 1 ? "open" : "closed";
        // checks - if state is same, ignore, if hysteresis running ignore
        if (runtime.current_state === globState)
            continue;
        if (runtime.hysteresis_timer)
            continue;
        // state different, hysteresis not active
        runtime.previous_state = runtime.current_state;
        runtime.current_state = globState;
        if (globState === "open") {
            if (!runtime.open_timestamp) { // if there is no record of opening
                runtime.open_timestamp = Date.now();
                runtime.open_confirmed = false;
            }
        }
        else {
            if (runtime.open_confirmed) {
                runtime.close_timestamp = Date.now();
                console.log(`[GLOB] ${currSensor.id}: Closing event.`);
                eventEngine.triggerOpenOrClose(currSensor, "closed");
            }
            runtime.open_timestamp = null;
            runtime.open_confirmed = false;
        }
    }
}
function handleTofEventMessage(msg, store, eventEngine) {
    if (msg.from !== "tof")
        return;
    const tofSensor = store.getTofSensorByMqttId(msg.client_id);
    if (!tofSensor)
        return;
    const sensorId = tofSensor?.id;
    if (!sensorId) {
        return;
    }
    let runtime = store.getRuntimeState(sensorId);
    if (!runtime)
        return;
    const targetState = msg.tof_status === 1 ? "open" : "closed";
    if (runtime.current_state === targetState)
        return;
    if (runtime.hysteresis_timer) {
        // reset hysteresis if it was already running.
        clearTimeout(runtime.hysteresis_timer);
        runtime.hysteresis_timer = undefined;
    }
    // start hysteresis
    runtime.hysteresis_target_state = targetState;
    runtime.hysteresis_start = Date.now();
    console.log(`[HYSTERESIS] ${sensorId}: ${runtime.previous_state} → ${runtime.current_state}`);
    runtime.hysteresis_timer = setTimeout(() => {
        finalizeHysteresis(store, sensorId, eventEngine);
    }, 3000);
}
function finalizeHysteresis(store, sensorId, eventEngine) {
    const runtime = store.getRuntimeState(sensorId);
    if (!runtime)
        return;
    if (!runtime.hysteresis_target_state)
        return;
    const newState = runtime.hysteresis_target_state;
    const now = Date.now();
    runtime.previous_state = runtime.current_state;
    runtime.current_state = newState;
    // clear hysteresis
    runtime.hysteresis_timer = undefined;
    runtime.hysteresis_target_state = undefined;
    runtime.hysteresis_start = undefined;
    // based on state
    if (newState === "open") {
        runtime.open_timestamp = now;
        runtime.open_confirmed = false;
        runtime.close_timestamp = null;
    }
    else { // if closing
        if (!runtime.open_confirmed) {
            runtime.open_timestamp = null;
        }
        else { // email was sent
            runtime.close_timestamp = now;
            // trigger event
            const sensor = store.getById(sensorId);
            if (!sensor)
                return;
            eventEngine.triggerOpenOrClose(sensor, newState);
            runtime.open_confirmed = false;
            runtime.last_email_timestamp = null;
            runtime.duration = undefined;
        }
    }
    console.log(`[HYSTERESIS] ${sensorId}: State confirmed -> ${runtime.current_state}`);
}
