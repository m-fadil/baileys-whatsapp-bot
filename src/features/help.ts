import { WAChat } from '@utils/chat';
import { ErrorWithSendMessage } from '@utils/errors';
import { ICommand, IFeature } from '@utils/interfaces';
import Cliui from 'cliui';

class Help implements IFeature {
    name = 'help';
    desc = 'menampilkan command';
    alias = ['h'];
    usage = ['help', 'help [command]'];

    constructor(private readonly chat: WAChat) {}

    async execute(inArgs: string[]): Promise<void> {
        const [inCommand] = inArgs;

        if (!inCommand) {
            await this.listFeature();
            return;
        }

        const command = this.chat.features.get(inCommand);
        if (!command) {
            throw new ErrorWithSendMessage(`perintah ${inCommand} tidak ada`);
        }

        await this.helpCommand(command);
    }

    public async listFeature(): Promise<void> {
        const ui = Cliui({ width: 120 });
        const features = [...this.chat.features.values()];
        const padding = [0, 0, 0, 0];

        ui.div({ text: '*daftar perintah:*', padding });
        features
            .filter((feature) => this.chat.parse.fromGroup || !feature.forGroup)
            .map((feature) => ui.div({ text: '> ' + feature.name, padding }));
        ui.div({ text: 'selengkapnya gunakan _help <command>_', padding: [1, 0, 0, 0] });

        await this.chat.sendMessage({ text: ui.toString() });
        ui.resetOutput();
    }

    public async helpCommand(command: ICommand): Promise<void> {
        const ui = Cliui({ width: 120 });
        const padding = [0, 0, 0, 0];

        ui.div({ text: '*description:*', padding });
        ui.div({ text: command.desc, padding });

        ui.div({ text: '*commands:*', padding: [1, 0, 0, 0] });
        command.usage.map((usage) => ui.div({ text: '> ' + usage, padding }));

        if (command.alias) {
            ui.div({ text: '*alias:*', padding: [1, 0, 0, 0] });
            ui.div({ text: '> ' + command.alias.join(', '), padding });
        }

        if (command.commands) {
            ui.div({ text: '*sub-commands:*', padding: [1, 0, 0, 0] });
            [...command.commands.keys()].map((command) => ui.div({ text: '> ' + command, padding }));
            ui.div({ text: 'detail perintah gunakan _help <command>_', padding: [1, 0, 0, 0] });
        }

        this.chat.sendMessage({ text: ui.toString() });
        ui.resetOutput();
    }
}

export default Help;
