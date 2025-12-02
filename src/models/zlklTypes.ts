export interface ZlklApiResponse {
    sens: ZlklSensor[];
    loc: ZlklLocation[];
}

export interface ZlklSensor {
    id: number;
    adr: string;
    nazev: string;
    mqtt_id: string;
    misto_id: number | null;

    curr_val?: number;
    curr_val_str?: string;
    online?: boolean;

    jednotky?: string;
    prec?: number;
    pomer?: number;
    cidlo_last_tx?: string;

    jednotky_popis?: string;
    jednotky_agr_typ?: string;
    jednotky_ico_css?: string;
    jednotky_ico_css_active?: string;
    jednotky_fail_val?: number;

    thresholds?: ZlklThresholds;
}

export interface ZlklLocation {
    id: number;
    pth: string;
    nazev: string;
    map: number;
    tof_prah_min: number;
    tof_maily?: string;
}

export interface ZlklThresholds {
    prahy: ZlklThreshold[];
    mailSendPrah?: number;
    mail_list?: string;
    message?: string;
}

export interface ZlklThreshold {
  enabled: boolean;
  prah: string; 
  minDelaySec: number; 
  extPrah?: string;
  extMinDelaySec?: number;
  msgType?: "warning" | "danger" | "info" | "success";
  mailSendPrah?: number;
  mail_list?: string;
  message?: string;
}

export interface ZlklEvent {
    id: number;
    typ: "open" | "closed";
    when?: number;
    sent?: number;
    to?: string;
}
