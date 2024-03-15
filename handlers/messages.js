import fs from "fs";
import Reaction from "../commands/etc/reaction.js";

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
        const pesan = pesanDatang.substring(1)
        const [ perintah ] = pesan.toLowerCase().split(" ")

        const fitur = Array.from(commands.values()).find(command => command.name == perintah || command.alias.includes(perintah))

        if (fitur) {
            fitur.execute({ ...args, Reaction, remoteJid, commands, pesan })
        }

        await sock.readMessages([messages.key])
    }
	// const senderNumber = messages[0].key.remoteJid;
	// const nomorPengirim = (messages[0].key.participant == undefined) ? messages[0].key.remoteJid.split('@')[0] : messages[0].key.participant.split('@')[0]
	// let incomingMessages = messages[0].message.conversation;
	// let quotedPesan = false
	// try {
	//     if (messages[0].message.hasOwnProperty('extendedTextMessage')) {
	//         incomingMessages = messages[0].message.extendedTextMessage.text;
	//         quotedPesan = messages[0].message.extendedTextMessage.contextInfo.hasOwnProperty('quotedMessage')
	//     }
	//     else if (messages[0].message.hasOwnProperty('imageMessage')) {
	//         incomingMessages = messages[0].message.imageMessage.caption;
	//     }
	// } catch (err) {
	// }

	// if (incomingMessages.startsWith(process.env.command)) {
	//     let text = incomingMessages.substring(process.env.command.length)
	//     let command = text.toLowerCase().split(' ')[0]
	//     let ident = ['@me', '@myself', '@saya', '@aku']
	//     ident.forEach(val => {
	//         if (text.includes(val)) {
	//             text = text.split(val).join(`@${nomorPengirim}`)
	//         }
	//     })
	//     let ada = false
	//     for await (let c of commands) {
	//         if (c[1].alias.includes(command) && !["ai", "reaction"].includes(command)) {
	//             commands.get(c[1].name).execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
	//             ada = true
	//             break
	//         }
	//     }
	//     if (!ada) commands.get("reaction").execute(sock, messages, false)
	//     await sock.readMessages([messages[0].key])
	// }
	// else if (incomingMessages.includes(process.env.tag)) {
	//     incomingMessages.split(" ").forEach(tag => {
	//         if (tag.includes(process.env.tag)) {
	//             var text = `tag ${tag.substring(process.env.tag.length)}`
	//             commands.get('tag').execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
	//         }
	//     })
	//     await sock.readMessages([messages[0].key])
	// }
	// else if (incomingMessages.startsWith(process.env.ai) && incomingMessages.length > 1) {
	//     var text = incomingMessages.substring(process.env.ai.length)
	//     commands.get('AI').execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database)
	//     await sock.readMessages([messages[0].key])
	// }
}

export default Messages;
