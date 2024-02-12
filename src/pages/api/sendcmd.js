import mqtt from "mqtt"
import NextCors from 'nextjs-cors';

const clientId = 'emqx_nodejs_' + Math.random().toString(16).substring(2, 8)
const username = 'emqx'
const password = 'public'

const client = mqtt.connect('mqtts://broker.emqx.io:8883', {
    clientId,
    username,
    password,
    // ...other options
})

const page = async (req, res) => {
    if (req.method != 'POST') {
        return res.status(405).json({ success: false, msg: req.method + " method not allowed" });
    }
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const data = req.body;
    if (!data.pin || !data.status) {
        return res.status(404).json({ success: false, msg: "Parameter missing" });
    }
    if (data.pin != process.env.pin) {
        return res.status(403).json({ success: false, msg: "Unauthorized" });
    }
    if (data.status != "on" && data.status != "off") {
        return res.status(404).json({ success: false, msg: "on/off accepted only" });
    }
    const topic = 'inhalesafe'
    const payload = data.status;
    const qos = 0
    const retain = true;
    client.subscribe(topic, { qos }, (error) => {
        if (error) {
            console.log('subscribe error:', error)
            return
        }
        console.log(`Subscribe to topic '${topic}'`)
    })
    client.publish(topic, payload, { qos, retain }, (error) => {
        if (error) {
            console.error(error)
            return res.status(500).json({ success: false, msg: error });
        }
    })
    return res.status(200).json({ success: true, msg: `Turned ${data.status}` })
}

export default page;