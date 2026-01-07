"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobMessage = handleGlobMessage;
exports.handleTofEventMessage = handleTofEventMessage;
function handleGlobMessage(msg, store, eventEngine) {
    /*
    for (const s of msg.t) {
      const currSensor = store.getByMqtt(msg.id, s.addr);
      if (!currSensor) continue;
      let sensorRuntime = store.getRuntimeState(currSensor.id);
      if (!sensorRuntime) continue;
      sensorRuntime.lastValue = s.val;
      sensorRuntime.lastUpdate = Date.now();
      console.log("Glob msg from MQTT correctly handled. Calling threshold engine.");
      thresholdEngine.processValue(currSensor, sensorRuntime, s.val, eventEngine);
    }
      */ //TODO
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
    /*
    let runtime = store.getRuntimeState(sensorId);
    if (!runtime) return;
    runtime.lastUpdate = Date.now();
    runtime.state = msg.tof_status === 1 ? "open" : "closed";
    runtime.lastValue = msg.tof_status;
    
  
    runtime.pendingStart = undefined;
    runtime.pendingState = undefined;
    if (runtime.pendingTimer) {
      clearTimeout(runtime.pendingTimer);
    }
    runtime.pendingTimer = undefined;
    console.log("Tof event msg from MQTT correctly handled. Calling event engine.");
    // trigger event sending and emails
    eventEngine.triggerOpenOrClose(tofSensor, runtime.state);
    */
    let runtime = store.getRuntimeState(sensorId);
    if (!runtime)
        return;
    const targetState = msg.tof_status === 1 ? "open" : "closed";
    if (runtime.current_state === targetState)
        return;
    if (runtime.hysteresis_timer) {
        // reset hysteresis if it was already running.
        clearTimeout(runtime.hysteresis_timer);
    }
    // start hysteresis
    runtime.hysteresis_target_state = targetState;
    runtime.hysteresis_start = Date.now();
    runtime.hysteresis_timer = setTimeout(() => {
        finalizeHysteresis(runtime);
    }, 3000);
}
function finalizeHysteresis(runtime) {
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
        }
    }
    console.log(`[HYSTERESIS] State confirmed -> ${runtime.current_state}`);
}
