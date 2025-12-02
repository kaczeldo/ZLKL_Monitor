import axios, {  AxiosInstance  } from "axios";
import { ZlklApiResponse, ZlklEvent } from "../models/zlklTypes";

export interface ZlklApiConfig {
  baseUrl: string;
  apiName: string;   // e.g. "tof_node_api"
  apiKey: string;    // provided API key
}

export class ZlklApi {
  private client: AxiosInstance;

  constructor(private config: ZlklApiConfig) {
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "X-API-NAME": this.config.apiName,
        "X-API-KEY": this.config.apiKey
      }
    });
  }

  async getSensors(): Promise<ZlklApiResponse> {
    try {
      const response = await this.client.get<ZlklApiResponse>("/default");
      console.log("Successfully fetched data from ZlklApi/Default.");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch sensors:", err);
      throw err;
    }
  }

  async sendEvent(eventBody: ZlklEvent): Promise<any> {
    try {
      const response = await this.client.post<any>("/event", eventBody);
      console.log("Successfully posted data to ZlklApi/Event.");
      return response.data;
    } catch (err) {
      console.error("Failed to send event:", err);
      throw err;
    }
  }
}
