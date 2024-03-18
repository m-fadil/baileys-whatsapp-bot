import axios from "axios"
import fs from "fs"

async function cari(keyword) {
    const userAgents = JSON.parse(fs.readFileSync("./tools/user-agents.json", "utf8"));
    
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
    alias: ["kbi", "ki", "k"],
    async execute(args) {
        const { sock, messages, remoteJid, Reaction, pesan, sendTyping } = args
        const [ _, ...kata ] = pesan.split(" ")

        if (kata.length == 1) {
            cari(kata).then(async (result) => {
                await sendTyping(args).then(async () => {
                    await sock.sendMessage(
                        remoteJid,
                        { text: `*lema:* ${result.lema}\n*arti:* ${result.arti.join(", \n")}` },
                        { quoted: messages }
                    );
                })
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            Reaction(args, false)
        }
    }
}

export default Kbbi