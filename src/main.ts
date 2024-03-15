import dotenv from "dotenv";
import { Baileys } from "./services/baileys";
dotenv.config();

const bot = new Baileys(process.env.AUTH_FOLDER!);
bot.connect();
