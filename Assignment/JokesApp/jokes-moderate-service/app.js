const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}@${process.env.RABBITMQ_HOST}`;
const IN_QUEUE_SUBMIT = process.env.QUEUE_SUBMITTED || 'SUBMITTED_JOKES';
const IN_QUEUE_TYPE_UPDATE = process.env.QUEUE_TYPE_UPDATE || 'TYPE_UPDATES';
const OUT_QUEUE = process.env.QUEUE_MODERATED || 'MODERATED_JOKES';
const TYPES_PATH = path.join(__dirname, 'storage', 'types.json');

async function startModerateService() {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();

        await channel.assertQueue(IN_QUEUE_SUBMIT, { durable: true });
        await channel.assertQueue(OUT_QUEUE, { durable: true });

        console.log(`Moderate service listening on ${IN_QUEUE_SUBMIT}...`);

        channel.consume(IN_QUEUE_SUBMIT, (msg) => {
            if (msg !== null) {
                const joke = JSON.parse(msg.content.toString());
                
                const typesData = JSON.parse(fs.readFileSync(TYPES_PATH, 'utf8'));
                const validTypes = typesData.map(t => t.type);

                if (validTypes.includes(joke.type)) {
                    console.log(`Joke approved: ${joke.setup}`);
                    channel.sendToQueue(OUT_QUEUE, Buffer.from(JSON.stringify(joke)), { persistent: true });
                } else {
                    console.log(`Joke rejected (invalid type): ${joke.type}`);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("Moderate Service Error:", error);
        setTimeout(startModerateService, 5000);
    }
}

startModerateService();