"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGlobMessage = handleGlobMessage;
exports.handleTofEventMessage = handleTofEventMessage;
function handleGlobMessage(msg, store, thresholdEngine, eventEngine) {
    for (const s of msg.t) {
        const currSensor = store.getByMqtt(msg.id, s.addr);
        if (!currSensor)
            continue;
        let sensorRuntime = store.getRuntimeState(currSensor.id);
        if (!sensorRuntime)
            continue;
        sensorRuntime.lastValue = s.val;
        sensorRuntime.lastUpdate = Date.now();
        console.log("Glob msg from MQTT correctly handled. Calling threshold engine.");
        thresholdEngine.processValue(currSensor, sensorRuntime, s.val, eventEngine);
    }
}
function handleTofEventMessage(msg, store, eventEngine) {
    const tofSensor = store.getTofSensorByMqttId(msg.client_id);
    const sensorId = tofSensor?.id;
    if (!sensorId) {
        return;
    }
    let runtime = store.getRuntimeState(sensorId);
    if (!runtime)
        return;
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
}
