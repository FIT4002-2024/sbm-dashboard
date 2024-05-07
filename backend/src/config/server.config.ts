import dotenv from 'dotenv';
dotenv.config();

export const READ_FREQUENCY_S:number = parseInt(<string>process.env.READ_FREQUENCY_S) || 10;
export const SERVER_PORT:number = parseInt(<string>process.env.READ_FREQUENCY_S) || 4000;