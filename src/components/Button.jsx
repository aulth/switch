'use client'
import React, { useEffect } from 'react'
import mqtt from 'mqtt';

const clientId = "emqx_react_" + Math.random().toString(16).substring(2, 8);
const username = "emqx";
const password = "public";
const client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
    clientId,
    username,
    password,
    // ...other options
});

const Button = () => {
    const mqttSub = () => {
        if (client) {
            const topic = 'inhalesafe';
            const qos = 0;
            client.subscribe(topic, { qos }, (error) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }
                console.log(`Subscribe to topics: ${topic}`)
            })
        }
    }

    const mqttPublish = (message) => {
        if (client) {
            const topic = 'inhalesafe';
            const qos = 0;
            const payload = message;
            client.publish(topic, payload, { qos }, (error) => {
                if (error) {
                    console.log("Publish error: ", error);
                }
            });
        }
    };

    client.on("message", (topic, message) => {
        console.log(`received message: ${message} from topic: ${topic}`);
    });

    useEffect(() => {
        mqttSub();
        // Cleanup function to unsubscribe when component unmounts
        return () => {
            if (client) {
                const topic = 'inhalesafe';
                client.unsubscribe(topic, (error) => {
                    if (error) {
                        console.log('Unsubscribe error:', error);
                    }
                });
            }
        };
    }, []);
    const handleChange = (e)=>{
        if(e.target.checked){
            mqttPublish('on')
        }else{
            mqttPublish('off')
        }
    }
    return (
        <>
            <div class="toggle">
                <input type="checkbox" onChange={handleChange} id="btn" />
                <label for="btn">
                    <span class="track">
                        <span class="txt"></span>
                    </span>
                    <span class="thumb">|||</span>
                </label>
            </div>
        </>
    );
}

export default Button;
