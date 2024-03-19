import fs from "fs";
import Reaction from "../commands/etc/reaction.js";
import getTags from "../functions/getTags.js";
import sendWithTyping from "../functions/sendWithTyping.js"

const commands = new Map();
const files = fs.readdirSync(`./commands`).filter((file) => file.endsWith(".js"));
for (const file of files) {
	const { default: command } = await import(`../commands/${file}`);
	commands.set(command.name, command);
}

async function Messages(args) {
	const { sock, messages } = args;

    const remoteJid = messages.key.remoteJid

	/**
	 * @type {String}
	 */
	const pesanDatang = messages.message.extendedTextMessage?.text || messages.message.imageMessage?.caption || messages.message.conversation;

    if (pesanDatang.startsWith(process.env.command)) {
        const pesan = pesanDatang.substring(1).replace()
        const [ perintah ] = pesan.toLowerCase().split(" ")

        const fitur = Array.from(commands.values()).find(command => command.name == perintah || command.alias.includes(perintah))

        if (fitur) {
			await sock.readMessages([messages.key])
            await fitur.execute({ ...args, sendWithTyping, Reaction, remoteJid, getTags, commands, pesan })
        }
    }
	else if (pesanDatang.includes(process.env.tag)) {
		const { tags, roles } = await getTags(args)
		const incomeTags = pesanDatang.split(" ").filter(teks => teks.includes(process.env.tag))
		
		const inisials = incomeTags.map(tag => roles.find(role => tag.includes(role)))
		
		for (const inisial of inisials) {
			if (inisial) {
				const tag = tags.roles.find(role => role.name == inisial)
				
				await sendWithTyping(args).then(async () => {
					await sock.sendMessage(
						remoteJid,
						{text: `*${inisial}*\n${tag.msg}`, mentions: tag.jids}
					);
				})
			}
		}
        await sock.readMessages([messages.key])
	}
}

export default Messages;
