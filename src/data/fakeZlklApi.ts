import axios from "axios";
import { ZlklApiResponse } from "../models/zlklTypes";

export class FakeZlklApi {
    private baseUrl: string = "http://192.168.88.46:12345";
    async getSensors() : Promise<ZlklApiResponse> {
        return {
            sens: [
                {
                    id: 1,
                    adr: "tof_state:FAKE:ADDR:01",
                    nazev: "Test Gate",
                    mqtt_id: "zlkl_test_gate",
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
                }

            ],
            loc: [
                {
                    id: 1,
                    pth: "Test / Gate",
                    nazev: "Test Location",
                    map: 0,
                    tof_prah_min: 1,
                    tof_maily: "test@example.com",
                },
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
                    "X-API-NAME": "fake-zlkl-api",
                    "X-API-KEY": "fake-key"
                }
            }
        )
    }
}