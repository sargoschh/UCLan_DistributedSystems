const { connect } = require('amqplib');
const dotenv = require('dotenv');

dotenv.config();

const DB_TYPE = process.env.DB_TYPE || 'mongo-db';
const MYSQL_MODULE = process.env.MYSQL_MODULE || '../dbModules/mysql-database-fns'
const MONGO_MODULE = process.env.MONGO_MODULE || '../dbModules/mongo-database-fns'

const db = (DB_TYPE === 'MYSQL') ? require(MYSQL_MODULE) : require(MONGO_MODULE);

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER || 'guest'}:${process.env.RABBITMQ_PASS || 'guest'}@rabbitmq-broker:5672`;
const QUEUE_NAME = process.env.QUEUE_MODERATED || 'MODERATED_JOKES';

async function startETL() {
    try {
        const connection = await connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        
        channel.prefetch(1);

        console.log(`ETL Service listening for messages on ${QUEUE_NAME}...`);

        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const joke = JSON.parse(msg.content.toString());
                console.log(`Received for processing: ${joke.setup}`);

                try {
                    await db.isConnected();
                    
                    await db.saveData('jokes', joke);
                    
                    console.log(`Successfully saved to ${DB_TYPE}`);
                    channel.ack(msg);
                } catch (dbError) {
                    console.error(`Database error: ${dbError.message}`);
                    channel.nack(msg, false, true); 
                }
            }
        });
    } catch (error) {
        console.error("ETL Connection Error:", error.message);
        setTimeout(startETL, 5000);
    }
}

startETL();