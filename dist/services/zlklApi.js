"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZlklApi = void 0;
const axios_1 = __importDefault(require("axios"));
class ZlklApi {
    constructor(config) {
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: this.config.baseUrl,
            headers: {
                "Content-Type": "application/json",
                "X-API-NAME": this.config.apiName,
                "X-API-KEY": this.config.apiKey
            }
        });
    }
    async getSensors() {
        try {
            const response = await this.client.get("/default");
            console.log("Successfully fetched data from ZlklApi/Default.");
            return response.data;
        }
        catch (err) {
            console.error("Failed to fetch sensors:", err);
            throw err;
        }
    }
    async sendEvent(eventBody) {
        try {
            const response = await this.client.post("/event", eventBody);
            console.log("Successfully posted data to ZlklApi/Event.");
            return response.data;
        }
        catch (err) {
            console.error("Failed to send event:", err);
            throw err;
        }
    }
}
exports.ZlklApi = ZlklApi;
