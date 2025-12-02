export interface MqttGlobMessage{
    first_time: string;
    uptime: string;
    time: string;
    id: string;
    ssid: string;
    wst: number;
    mem:number;
    temp_err_name: string;
    ip: string;
    bssid: string;
    t: MqttSensorValue[];
}

export interface MqttSensorValue{
    addr: string;
    val: number;
}

export interface MqttTofEventMessage{
    client_id: string;
    time: string;
    tof_onoff: boolean;
    from: string;
    tof: number;
    tof_status: 0 | 1;
}