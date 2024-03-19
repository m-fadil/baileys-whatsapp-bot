//masih belum

const Help = {
    name: "help",
    description: "menampilkan commands",
    alias: ["h"],
    isGroup: true,
    async execute(args) {
        const { sock, messages, commands, pesan, sendWithTyping } = args
        const [ _, command ] = pesan.split(" ")

        var help = ""
        var ada = false
        if (command) {
            commands.forEach(async c => {
                if (c.alias.includes(command)) {
                    help = `*command*: ${c.name}\n*alias*: ${c.alias.join(", ")}\n*deskripsi*: ${c.description}`
                    ada = true
                }
            })
            if (!ada) commands.get("reaction").execute(sock, messages, false)
        }
        else if (_){
            help = messages.key.participant == undefined
                ? `/echo *text*
/getcontact *nomor*
/help
/help *command*
/kbbi *kata*
/sticker *judul pembuat*
/note
/note add *subjek isi*
/note remove *subjek*
?<text to chat>\n
*NB**
Nomor pengirim = @me, @myself, @aku, @saya\n
*judul* dan *pembuat* boleh kosong`
                : `/all
/echo *text*
/getcontact *nomor*
/help
/help *command*
/kbbi *kata*
/note
/note add *subjek isi*
/note remove *subjek*
/sticker *judul pembuat*
/tag
/tag add *inisial @.. @..*
/tag edit *inisial_lama inisial_baru*
/tag remove *inisial*
/tag *inisial*
/tag *inisial add @.. @..*
/tag *inisial remove @.. @..*
*#inisial*
?<text to chat>\n
Anonim chat buka: cutt.ly/anonim-chat\n
*NB**
Nomor pengirim = @me, @myself, @aku, @saya\n
*judul* dan *pembuat* boleh kosong`
        
        }
        await sendWithTyping(
            args,
            {text: help},
            {quoted: messages}
        );
    }
}

export default Help