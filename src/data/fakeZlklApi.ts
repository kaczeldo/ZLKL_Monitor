import axios from "axios";
import { ZlklApiResponse } from "../models/zlklTypes";

export class FakeZlklApi {
    private baseUrl: string = "http://192.168.88.46:12345";
    private mqttId: string = "zlkl_grot_test_00155d000104";
    async getSensors() : Promise<ZlklApiResponse> {
        return {
            sens: [
                {
                    id: 1,
                    adr: `${this.mqttId}::door_1`,
                    nazev: "Lakovna",
                    mqtt_id: this.mqttId,
                    misto_id: 1,
                    thresholds: {
                        prahy: [
                            {
                                enabled: true,
                                prah: "<10",
                                minDelaySec: 3
                            }
                        ]
                    }
                },
                {
                    id: 2,
                    adr: `${this.mqttId}::door_2`,
                    nazev: "Strojovna 1",
                    mqtt_id: this.mqttId,
                    misto_id: 2,
                    thresholds: {
                        prahy: [
                            {
                                enabled: true,
                                prah: "<10",
                                minDelaySec: 3
                            }
                        ]
                    }
                },
                {
                    id: 3,
                    adr: `${this.mqttId}::door_3`,
                    nazev: "Strojovna 2",
                    mqtt_id: this.mqttId,
                    misto_id: 2,
                    thresholds: {
                        prahy: [
                            {
                                enabled: true,
                                prah: "<10",
                                minDelaySec: 3
                            }
                        ]
                    }
                },
                {
                    id: 4,
                    adr: `${this.mqttId}::door_4`,
                    nazev: "Stara Lakovna",
                    mqtt_id: this.mqttId,
                    misto_id: 3,
                    thresholds: {
                        prahy: [
                            {
                                enabled: true,
                                prah: "<10",
                                minDelaySec: 3
                            }
                        ]
                    }
                }

            ],
            loc: [
                {
                    id: 1,
                    pth: "Test / Gate",
                    nazev: "Lakovna",
                    map: 0,
                    tof_prah_min: 0.1,
                    tof_maily: "test@example.com",
                },
                {
                    id: 2,
                    pth: "Test / Gate",
                    nazev: "Strojovna",
                    map: 0,
                    tof_prah_min: 0.2,
                    tof_maily: "test@example.com",
                },
                {
                    id: 3,
                    pth: "Test / Gate",
                    nazev: "Stara Lakovna",
                    map: 0,
                    tof_prah_min: 0.3,
                    tof_maily: "test@example.com",
                }
            ],
        };
    }

    async sendEvent(event: any) : Promise<void> {
        await axios.post(
            `${this.baseUrl}/events`,
            event,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
    }
}