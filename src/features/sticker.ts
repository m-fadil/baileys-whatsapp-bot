import { WAChat } from '@utils/chat';
import { ErrorWithSendMessage } from '@utils/errors';
import { IFeature } from '@utils/interfaces';
import { downloadMediaMessage, generateWAMessageFromContent, WAMessage, WAMessageContent } from '@whiskeysockets/baileys';
import { Chance } from 'chance';
import { createSticker, StickerTypes } from 'wa-sticker-formatter';
import { FormData } from 'formdata-node';
import * as cheerio from 'cheerio';
import axios from 'axios';
import parse from 'yargs-parser';

class Sticker implements IFeature {
    name = 'sticker';
    desc = 'membuat sticker dari gambar';
    alias = ['stiker', 's'];
    usage = ['sticker [title] [author]'];

    constructor(private readonly chat: WAChat) {}

    async execute(inArgs: string[]): Promise<void> {
        const parsedArgs = parse(inArgs);
        const [title, author] = parsedArgs['_'].map((arg) => arg.toString());

        if (parsedArgs?.url) {
            await this.fromURL(parsedArgs.url, title, author)
            return
        }

        const message: (WAMessageContent & Object) | undefined | null = this.chat.messages?.message;
        const quotedMessage: WAMessageContent | undefined | null = message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const isImageMessage = message?.hasOwnProperty('imageMessage');
        const isQuotedImageMessage = quotedMessage?.hasOwnProperty('imageMessage');

        if (!isImageMessage && !isQuotedImageMessage) {
            throw new ErrorWithSendMessage('gambar tidak ditemukan');
        }

        if (message?.hasOwnProperty('imageMessage')) {
            this.fromMessage(this.chat.messages, title, author);
        }

        if (quotedMessage?.hasOwnProperty('imageMessage')) {
            const mediaMessage = generateWAMessageFromContent(this.chat.parse.remoteJid, quotedMessage, {
                userJid: this.chat.parse.sender,
            });
            this.fromMessage(mediaMessage, title, author);
        }
    }

    async createAndSendSticker(image: Buffer, title?: string | undefined, author?: string | undefined) {
        const chance = new Chance();

        const id = chance.string({ pool: '0123456789', length: 6 });
        const sticker = await createSticker(image, {
            pack: title ?? chance.sentence({ words: 2 }),
            author: author || this.chat.messages.pushName || '~',
            type: StickerTypes.FULL,
            id,
            quality: 50,
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 0,
            },
        });

        await this.chat.sendMessage({ sticker });
    }

    async fromMessage(mediaMessage: WAMessage, title?: string | undefined, author?: string | undefined) {
        const image = await downloadMediaMessage(mediaMessage, 'buffer', {});
        
        await this.createAndSendSticker(image, title, author);
    }

    async fromURL(url: string, title?: string | undefined, author?: string | undefined) {
        const form = new FormData();
        const validUrl = /https:\/\/([^\/]+)\//g.exec(url)?.[1];

        if (!validUrl || validUrl != 'x.com') throw new ErrorWithSendMessage('invalid url');
        
        form.set("q", url);
        form.set("lang", "en");

        const response = await axios({
            url: 'https://savetwitter.net/api/ajaxSearch',
            method: 'POST',
            data: form,
        });

        const { data } = response.data;
        const $ = cheerio.load(data);
        const imageUrl = $('img').attr('src');

        if (!imageUrl) {
            throw new ErrorWithSendMessage('image not found');
        }

        const imageBuffer = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });

        await this.createAndSendSticker(imageBuffer.data, title, author);
    }
}

export default Sticker;
