import { ICommand } from '@utils/interfaces';
import { TagController } from '../tag.controller';
import { RoleService } from './role.service';
import { IRole } from '@model/model';
import { ErrorWithSendReaction } from '@utils/errors';
import { WAChat } from '@utils/chat';

export class RoleController {
    public readonly commands: Map<string, ICommand>;
    public readonly roleService: RoleService;

    constructor(
        private readonly chat: WAChat,
        private readonly tagController: TagController,
    ) {
        this.roleService = new RoleService(this.chat, this.tagController, this);

        this.commands = this.mapCommands();
    }

    private mapCommands(): Map<string, ICommand> {
        const roleCommands: ICommand[] = [
            {
                name: 'add',
                usage: ['tag edit <role> *add* <@at> <@at>'],
                desc: 'menambahkan anggota',
                execute: this.roleService.roleAddUsers.bind(this.roleService),
            },
            {
                name: 'remove',
                usage: ['tag edit <role> *remove* <@at> <@at>'],
                desc: 'menghapus anggota',
                execute: this.roleService.roleRemoveUsers.bind(this.roleService),
            },
            {
                name: 'rename',
                usage: ['tag edit <role> *rename* <newName>'],
                desc: 'mengubah nama role',
                execute: async (role: IRole, inArgs: string[]) => {
                    await this.chat.isCommands(inArgs);
                    return this.roleService.roleRename(role, inArgs);
                },
            },
            {
                name: 'help',
                usage: ['help [command]'],
                desc: 'menampilkan detail command',
                execute: async (inArgs: string[]) => {
                    throw new ErrorWithSendReaction();
                },
            },
        ];

        return new Map(roleCommands.map((command) => [command.name, command]));
    }
}
