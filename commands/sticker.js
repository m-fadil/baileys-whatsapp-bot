import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { Sticker, createSticker, StickerTypes } from 'wa-sticker-formatter';

const CreateSticker = {
	name: 'sticker',
	description: 'membuat sticker dari gambar',
	alias: ['stiker', 's'],
	async execute(args) {
		/**
		 * kurang fitur quoted pesan bergambar dijadikan sticker
		 */
		const { sock, messages, remoteJid, Reaction, pesan } = args;
		const [_, judul, pembuat] = pesan.split(' ');

		try {
			if (
				messages.message.hasOwnProperty('imageMessage') ||
				messages.message.extendedTextMessage.contextInfo.hasOwnProperty('quotedMessage')
			) {
				let rdm = Math.floor(Math.random() * 99999).toString();
				let rawId = '0'.repeat(5 - rdm.length) + rdm;
				if (messages.message.hasOwnProperty('imageMessage')) {
					var m = messages;
				}
				const image = await downloadMediaMessage(m, 'buffer', {});
				const sticker = new Sticker(image, {
					pack: judul,
					author: pembuat || messages.pushName,
					type: StickerTypes.FULL,
					categories: ['🤩', '🎉'],
					id: rawId,
					quality: 50,
					background: {
						r: 255,
						g: 255,
						b: 255,
						alpha: 0,
					},
				});
				await sock.sendMessage(remoteJid, await sticker.toMessage(), { quoted: messages });
			}
		} catch (error) {
			Reaction(args, false);
		}
	},
};

export default CreateSticker;
