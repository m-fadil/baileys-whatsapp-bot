const AddNote = {
    name: "add_note",
    description: "menyimpan catatan",
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database, coll_note, draft) {
        if (text.split(" ").length >= 3) {
            let subjek = text.split(' ')[2]

            if (!draft.notes.find(notes => notes.subject == subjek)) {
                if (!text.split(" ").slice(3).join(" ")) {
                    if (quotedPesan) {
                        let isi = !messages[0].message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text
                                ? messages[0].message.extendedTextMessage.contextInfo.quotedMessage.conversation
                                : messages[0].message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text
                                
                        pushData(subjek, isi)
                    }
                    else {
                        commands.get("reaction").execute(sock, messages, false)
                    }
                }
                else {
                    let isi = text.split(" ").slice(3).join(" ")
                    pushData(subjek, isi)
                }
            }
            else {
                await sock.sendMessage(
                    senderNumber,
                    {text: `subjek ${subjek} sudah ada`},
                    {quoted: messages[0]},
                    1000
                );
            }
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }

        async function pushData(subjek, isi) {
            const data = {
                $push: {
                    "notes": {
                        subject: subjek,
                        text: isi,
                    }
                }
            }
            await coll_note.updateOne({"title": draft.title}, data).then(() => {
                commands.get("reaction").execute(sock, messages, true)
            })
        }
    }
}

export default AddNote