"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThresholdEngine = void 0;
class ThresholdEngine {
    processValue(sensor, runtime, newValue, eventEngine) {
        const thresholds = sensor.thresholds?.prahy ?? [];
        if (thresholds.length === 0) {
            return;
        }
        for (const prah of thresholds) {
            if (!prah.enabled)
                continue;
            if (prah.extPrah) {
                //skip for now
                continue;
            }
            const desiredState = this.getDesiredState(prah, newValue);
            // if the new state, based on new value, is same as the current state,
            if (desiredState === runtime.state) {
                // clear pending fields
                if (runtime.pendingTimer) {
                    clearTimeout(runtime.pendingTimer);
                }
                runtime.pendingTimer = undefined;
                runtime.pendingStart = undefined;
                runtime.pendingState = undefined;
                continue;
            }
            // if the new state is already pending,
            if (runtime.pendingTimer && desiredState === runtime.pendingState) {
                //do nothing
                continue;
            }
            // here we know the pending state !== desired state
            if (runtime.pendingTimer) {
                clearTimeout(runtime.pendingTimer);
            }
            // start new timer
            console.log("starting new timer.");
            runtime.pendingStart = Date.now();
            runtime.pendingState = desiredState;
            runtime.pendingTimer = setTimeout(() => {
                this.finalizeThreshold(sensor, runtime, prah, eventEngine);
            }, prah.minDelaySec * 1000);
        }
    }
    parseOperator(expr) {
        if (expr.startsWith("<="))
            return "<=";
        if (expr.startsWith(">="))
            return ">=";
        if (expr.startsWith("="))
            return "=";
        if (expr.startsWith("<"))
            return "<";
        if (expr.startsWith(">"))
            return ">";
        throw new Error("Invalid threshold operator: " + expr);
    }
    parseThresholdValue(expr) {
        const num = Number(expr.replace(/[^0-9.-]/g, ""));
        return num;
    }
    evaluateThreshold(expr, value) {
        const operator = this.parseOperator(expr);
        const thValue = this.parseThresholdValue(expr);
        switch (operator) {
            case "<":
                return value < thValue;
            case "<=":
                return value <= thValue;
            case "=":
                return value == thValue;
            case ">":
                return value > thValue;
            case ">=":
                return value >= thValue;
            default:
                throw new Error("Invalid threshold operation." + operator);
        }
        return false;
    }
    finalizeThreshold(sensor, runtime, prah, eventEngine) {
        // pokud nemam posledni hodnotu, nemuzeme verifikovat -> zastavime proces
        if (runtime.lastValue == null) {
            if (runtime.pendingTimer) {
                clearTimeout(runtime.pendingTimer);
            }
            runtime.pendingTimer = undefined;
            runtime.pendingStart = undefined;
            runtime.pendingState = undefined;
            console.log("No last value in runtime. Canceling timer.");
            return;
        }
        // vypocitej znova chteny stav
        const desiredState = this.getDesiredState(prah, runtime.lastValue);
        // pokud se chteny stav neshoduje s cekajicim stavem
        if (desiredState !== runtime.pendingState) {
            // zrusme casovac
            if (runtime.pendingTimer) {
                clearTimeout(runtime.pendingTimer);
            }
            runtime.pendingTimer = undefined;
            runtime.pendingStart = undefined;
            runtime.pendingState = undefined;
            console.log("Pending state not equal to desired state. Canceling timer.");
            return;
        }
        // zde je vse v poradku, dokonceme operaci a odesleme event.
        runtime.state = runtime.pendingState;
        if (runtime.pendingTimer) {
            clearTimeout(runtime.pendingTimer);
        }
        runtime.pendingTimer = undefined;
        runtime.pendingStart = undefined;
        runtime.pendingState = undefined;
        console.log("Timer finalized. Calling event engine.");
        eventEngine.triggerOpenOrClose(sensor, runtime.state);
    }
    getDesiredState(prah, newVal) {
        return this.evaluateThreshold(prah.prah, newVal) ? "open" : "closed";
    }
}
exports.ThresholdEngine = ThresholdEngine;
