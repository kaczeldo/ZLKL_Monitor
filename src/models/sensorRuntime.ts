export type DoorState = "open" | "closed";

export interface DoorRuntimeState {
    previous_state: DoorState | null;
    current_state: DoorState;

    open_timestamp: number | null; // time when doors become open -> after hysteresis!
    close_timestamp: number | null; // time when doors are closed -> after tof event close state

    open_confirmed: boolean; // true if notification was already sent
    last_email_timestamp: number | null; // set when notification is sent

    hysteresis_target_state?: DoorState; // the new possible state which is being checked
    hysteresis_timer?: NodeJS.Timeout; // timer
    hysteresis_start?: number; // moment when hysteresis started

    duration?: number;
    tof_prah_min?: number;
}