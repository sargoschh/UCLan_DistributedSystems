const express = require('express');
const amqp = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.SUBMIT_PORT_APPLICATION || 3200;
const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASS || 'guest'}@${process.env.RABBITMQ_HOST || 'rabbitmq-broker'}:5672`;
const QUEUE_NAME = process.env.QUEUE_SUBMITTED || 'SUBMITTED_JOKES';

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        
        console.log(`Connected to RabbitMQ at ${RABBITMQ_URL}`);
    } catch (error) {
        console.error("RabbitMQ Connection Failed:", error.message);
        setTimeout(connectRabbitMQ, 5000); 
    }
}

app.post('/submit', async (req, res) => {
    const { type, setup, punchline } = req.body;

    if (!type || !setup || !punchline) {
        return res.status(400).json({ error: "Missing joke fields" });
    }

    const jokeData = { type, setup, punchline, timestamp: new Date() };

    try {
        if (!channel) throw new Error("Message channel not established");

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(jokeData)), {
            persistent: true
        });

        console.log(`Sent Joke to ${QUEUE_NAME}:`, setup);
        res.status(202).json({ message: "Joke submitted for moderation" });
        
    } catch (error) {
        console.error("Submission failed:", error.message);
        res.status(500).json({ error: "Could not process submission" });
    }
});

app.listen(PORT, () => {
    console.log(`Producer service running on http://localhost:${PORT}`);
    connectRabbitMQ();
});