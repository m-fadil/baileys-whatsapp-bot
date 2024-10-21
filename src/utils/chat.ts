import { AnyMessageContent, WAMessage, WASocket } from '@whiskeysockets/baileys';
import splitargs from 'splitargs';
import { ErrorWithSendMessage } from './errors';
import { handleFeatures } from '@handlers/handle-features';
import { HandleParse } from '@handlers/handle-parse';
import { HandleError, HandleIsCommand } from '@handlers/handle-error';
import { CustMiscMessageGenerationOptions, HandleSend, ReactionType } from '@handlers/handle-send';
import { IFeature } from './interfaces';

export class WAChat {
    public readonly sock: WASocket;
    public readonly messages: WAMessage;
    public readonly parse: HandleParse;
    public readonly handleError: HandleError;
    public readonly sendMessage: (content: AnyMessageContent, custOpts?: CustMiscMessageGenerationOptions) => Promise<void>;
    public readonly sendReaction: (type?: ReactionType) => Promise<void>;
    public readonly isCommands: (inArgs: string[]) => Promise<void>;
    public readonly features: Map<string, IFeature>;

    private readonly handleIsCommand: HandleIsCommand;
    private readonly handleSend: HandleSend;

    constructor(wasock: WASocket, messages: WAMessage) {
        this.sock = wasock;
        this.messages = messages;
        this.parse = new HandleParse(this);
        this.handleSend = new HandleSend(this);
        this.handleError = new HandleError(this);
        this.handleIsCommand = new HandleIsCommand(this);

        this.sendReaction = this.handleSend.reaction.bind(this.handleSend);
        this.sendMessage = this.handleSend.message.bind(this.handleSend);
        this.isCommands = this.handleIsCommand.exe.bind(this.handleIsCommand);
        this.features = new Map<string, IFeature>();
    }

    async run(): Promise<void> {
        const pesanDatang: string | null | undefined =
            this.messages.message?.extendedTextMessage?.text ||
            this.messages.message?.imageMessage?.caption ||
            this.messages.message?.conversation;

        if (!pesanDatang) return;

        if (!pesanDatang.startsWith(process.env.COMMAND_PREFIX!)) {
            return;
        }

        const replaceMe = ['@me', '@aku', '@self', '@saya'];
        const regex = new RegExp(replaceMe.join('|'), 'g');
        const parsedPesan = pesanDatang.replace(regex, `@${this.parse.sender.split('@')[0]}`);

        await this.sock.readMessages([this.messages.key]);

        const inMessage = parsedPesan.substring(process.env.COMMAND_PREFIX!.length);
        const inArgs = splitargs(inMessage);

        const [inCommand] = inArgs.splice(0, 1);
        if (!inCommand) return;

        const features = await handleFeatures(this);

        const feature =
            features.get(inCommand) ||
            [...features.values()].find((f) => f.alias?.includes(inCommand));
        if (!feature) throw new ErrorWithSendMessage(`perintah ${inCommand} tidak ada`);
        await feature.execute(inArgs);
    }

    async handle(): Promise<void> {
        (<any>this).features = await handleFeatures(this);
        this.run().catch(async (err) => await this.handleError.exe(err));
    }
}
