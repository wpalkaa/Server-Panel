const mqtt = require('mqtt');

const BROKER = process.env.BROKER_URL;

const MQTTConnect = () => {
    const client = mqtt.connect(BROKER);

    client.on('connect', () => {
        console.log(`[Info]: Server connected to MQTT broker.`);

        setInterval(() => {
            const time = new Date().toLocaleTimeString("pl-PL");

            const cpuData = {
                time: time,
                value: Math.random() * 100
            };
            client.publish('stats/cpu', JSON.stringify(cpuData));

            const memData = {
                time: time,
                value: Math.random() * 8000
            };
            client.publish('stats/memory', JSON.stringify(memData));

            const diskData = {
                time: time,
                value: Math.random() * 10
            };
            client.publish('stats/disk', JSON.stringify(diskData));

        }, 2000);
    });

    client.on('error', (err) => {
        console.error('[MQTT] Connection error:', err);
    });
}

module.exports = MQTTConnect; 