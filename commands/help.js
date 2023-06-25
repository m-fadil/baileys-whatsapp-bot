module.exports = {
    name: "help",
    description: "menampilkan commands",
    alias: ["help", "h"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan) {
        var help = (messages[0].key.participant == undefined)?
        `/getcontact *nomor*\n/kbbi *kata*\n/sticker *judul pembuat*\n/note add *subjek isi*\n/note remove *subjek*\n?<text to chat>\n\n*NB**\nNomor pengirim = @me, @myself, @aku, @saya\n\n*judul* dan *pembuat* boleh kosong`:
        `/all\n/getcontact *nomor*\n/kbbi *kata*\n/note add *subjek isi*\n/note remove *subjek*\n/sticker *judul pembuat*\n/tag\n/tag add *inisial @.. @..*\n/tag edit *inisial_lama inisial_baru*\n/tag remove *inisial*\n/tag *inisial*\n/tag *inisial add @.. @..*\n/tag *inisial remove @.. @..*\n*#inisial*\n?<text to chat>\n\n*NB**\nNomor pengirim = @me, @myself, @aku, @saya\n\n*judul* dan *pembuat* boleh kosong`
        await sock.sendMessage(
            senderNumber,
            {text: help},
            {quoted: messages[0]},
            1000
        );
    }
}