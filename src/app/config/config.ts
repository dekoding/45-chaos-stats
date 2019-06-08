import redis from "ioredis";
import base from "./config.json";

// Set globally accessible constants (avoids repetition)
const trumpInaugural: Date = new Date(Date.parse("2017-01-20"));
const oneDay: number = 24 * 60 * 60 * 1000;

const client = new redis(base.redis);

if (process.env.UPDATE_INTERVAL) {
    base.defaultUpdateInterval = parseInt(process.env.UPDATE_INTERVAL, 10);
}

let port: number|string|false = base.express.port;
if (process.env.PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (isNaN(parsed)) {
        // named pipe
        port = process.env.PORT;
    } else if (parsed >= 0) {
        // port number
        port = parsed;
    } else {
        port = false;
    }
}

export default { base, port, client, trumpInaugural, oneDay };
