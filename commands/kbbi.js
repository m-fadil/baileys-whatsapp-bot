import userAgents from "../tools/user-agents.json" assert { type: 'json' };
import axios from 'axios'

async function cari(keyword) {
    if (!keyword) throw new Error("Provide the keyword/kata kunci!")
    const response = await axios.get(`https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${keyword}`, {
        headers: {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
        },
    });

    if (response.status < 200 || response.status >= 300) {
        throw new Error('Request failed with status: ' + response.status);
    }

    const data = response.data;
    return data;
}

const Kbbi = {
    name: "kbbi",
    description: "mencari arti kata (lema/sub lema)",
    alias: ["kbbi", "kbi", "ki", "k"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        if (text.split(" ").length >= 2) {
            let kata = text.split(" ").splice(1).join(" ")
            cari(kata).then(async (result) => {
                await sock.sendMessage(
                    senderNumber,
                    { text: `*lema:* ${result.lema}\n*arti:* ${result.arti.join(", \n")}` },
                    { quoted: messages[0] },
                    1000
                );
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            commands.get("reaction").execute(sock, messages, false)
        }
    }
}

export default Kbbi