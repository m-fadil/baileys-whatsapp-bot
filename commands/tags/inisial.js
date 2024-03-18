import InisialAdd from "./inisial/inisial_add.js"
import InisialRemove from "./inisial/inisial_remove.js"

const Inisial = {
    name: "inisial",
    description: "tag anggota",
    alias: [],
    async execute(args) {
        const { sock, Reaction, remoteJid, pesan, tags } = args
        const [ _, inisial, perintah, ...at ] = pesan.split(" ")

        if (perintah == 'add') {
            InisialAdd.execute(args, inisial, at)
        }
        else if (perintah == 'remove' || perintah == 'del') {
            InisialRemove.execute(args, inisial, at)
        }
        else if (inisial) {
            const tag = tags.roles.find(role => role.name == inisial)

            await sendTyping(args).then(async () => {
                await sock.sendMessage(
                    remoteJid,
                    {text: `*${inisial}*\n${tag.msg}`, mentions: tag.jids}
                );
            })
        }
        else {
            Reaction(args, false)
        }
    }
}

export default Inisial