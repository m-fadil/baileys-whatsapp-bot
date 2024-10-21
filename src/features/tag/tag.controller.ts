import { ICommand } from '@utils/interfaces';
import { TagService } from './tag.service';
import { RoleController } from './role/role.controller';
import { WAChat } from '@utils/chat';

export class TagController {
    public readonly commands: Map<string, ICommand>;
    public readonly tagService: TagService;
    public readonly roleController: RoleController;

    constructor(private readonly chat: WAChat) {
        this.roleController = new RoleController(this.chat, this);
        this.tagService = new TagService(this.chat, this);

        this.commands = this.mapCommands();
    }

    private mapCommands(): Map<string, ICommand> {
        const tagCommands: ICommand[] = [
            {
                name: 'add',
                desc: 'menambahkan tag dan anggotanya',
                usage: ['tag *add* <role>', 'tag add <role> <@at> <@at>'],
                execute: async (inArgs: string[]) => {
                    await this.chat.isCommands(inArgs);
                    return this.tagService.tagAddRole(inArgs);
                },
            },
            {
                name: 'remove',
                usage: ['tag *remove* <role>'],
                desc: 'menghapus tag',
                execute: async (inArgs: string[]) => {
                    await this.chat.isCommands(inArgs);
                    return this.tagService.tagRemoveRole(inArgs);
                },
            },
            {
                name: 'edit',
                usage: ['tag *edit* <role> [sub-commands]'],
                desc: 'mengedit tag dan anggotanya',
                commands: this.roleController.commands,
                execute: this.tagService.tagEdit.bind(this.tagService),
            },
            {
                name: 'help',
                usage: ['help [command]'],
                desc: 'menampilkan detail command',
                execute: this.tagService.tagHelp.bind(this.tagService),
            },
        ];

        return new Map<string, ICommand>(tagCommands.map((command) => [command.name, command]));
    }
}
