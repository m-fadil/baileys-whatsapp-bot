import P from 'pino';

const MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` }, P.destination('./baileys/wa-logs.txt'));

export default MAIN_LOGGER;
