export type DoorState = "open" | "closed" | "unknown";

export interface SensorRuntimeState {
    id: number;
    lastValue: number | null;
    lastUpdate: number | null;
    state: DoorState; // 
    pendingTimer?: NodeJS.Timeout;
    pendingState?: DoorState;
    pendingStart?: number;
}