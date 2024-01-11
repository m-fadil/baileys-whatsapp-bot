const Echo = {
    name: "echo",
    description: "mengembalikan value yang dimasukkan",
    alias: ["echo", "print", "ec"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        let kata = text.split(" ").splice(1).join(" ")
        await sock.sendMessage(
            senderNumber,
            { text: kata},
            { quoted: messages[0] },
            1000
        );
    }
}

export default Echo