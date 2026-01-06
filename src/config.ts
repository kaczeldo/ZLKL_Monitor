export const config = {
    api: {
        baseUrl: process.env.ZLKL_API_URL!,
        apiName: "tod_node_api",
        apiKey: process.env.ZLKL_API_KEY!,
    },
    mqtt: {
        url: process.env.MQTT_URL!,
        username: process.env.MQTT_USER,
        password: process.env.MQQ_PASS,
    }
}