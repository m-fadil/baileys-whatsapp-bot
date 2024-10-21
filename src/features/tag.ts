import { ICommand, IFeature } from '@utils/interfaces';
import { Group, IUser, Role } from '@model/model';
import { ErrorWithSendMessage } from '@utils/errors';
import { TagController } from './tag/tag.controller';
import { TagService } from './tag/tag.service';
import { WAChat } from '@utils/chat';

class Tag implements IFeature {
    name = 'tag';
    desc = 'menampilkan tags';
    alias = ['t', 'tg'];
    usage = ['tag', 'tag <role>', 'tag <sub-command>'];
    forGroup = true;
    commands: Map<string, ICommand>;

    private readonly tagController: TagController;
    private readonly tagService: TagService;

    constructor(private readonly chat: WAChat) {
        this.tagController = new TagController(this.chat);

        this.commands = this.tagController.commands;
        this.tagService = this.tagController.tagService;
    }

    async execute(inArgs: string[]): Promise<void> {
        const [inCommand] = inArgs.splice(0, 1);

        /**
         * tag <undefined>
         */
        if (!inCommand) {
            const group = await Group.findOneAndUpdate(
                { remoteJid: this.chat.parse.remoteJid },
                { remoteJid: this.chat.parse.remoteJid },
                { upsert: true, new: true },
            );

            const roles = await Role.find({ groupID: group.id });

            if (roles.length === 0) {
                throw new ErrorWithSendMessage('tidak ada tag');
            }

            const roleNames = roles.map((role) => role.name);
            await this.chat.sendMessage({ text: roleNames.join('\n') });
            return;
        }

        /**
         * tag <role>
         */
        if (inCommand === 'all') {
            await this.tagService.tagAll();
            return;
        }

        const role = await Role.findOne({ name: inCommand }).populate<{ userIDs: IUser[] }>('userIDs');

        if (role) {
            await this.tagService.tagSendMembers(role);
            return;
        }

        /*
         * tag <sub-command>
         */
        const command = this.commands.get(inCommand);
        if (!command) {
            throw new ErrorWithSendMessage(`perintah ${inCommand} tidak ada`);
        }

        await command.execute(inArgs);
    }
}

export default Tag;
