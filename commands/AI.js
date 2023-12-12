const Enmap = require("enmap")
// const fetch = require('node-fetch');
const axios = require('axios')

async function generateResponse(text) {
    const options = {
        method: "POST",
        url: "https://openai80.p.rapidapi.com/chat/completions",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.apiKey,
            "X-RapidAPI-Host": "openai80.p.rapidapi.com",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: text,
        }),
    }

    return new Promise(function (resolve, reject) {
        axios(options)
            .then((response) => {
                if (response.status === 200) {
                    return response.data;
                } else {
                    throw new Error("Request failed with status: " + response.status);
                }
            })
            .then((body) => resolve([false, body.choices[0].message]))
            .catch((error) => reject([true, error]));
            })

}
let waktuJalan = false

module.exports = {
    name: "AI",
    description: "chat dengan AI",
    alias: ["ai"],
    async execute(sock, messages, commands, senderNumber, text, quotedPesan, client, database) {
        console.log("bismillah")
        if (senderNumber.includes("@g.us")) {
        var grup = await sock.groupMetadata(senderNumber);
            var db = new Enmap({name: `${process.env.enmap}${grup.id}`, dataDir: './database'})
        }
        else {
            var db = new Enmap({name: `${process.env.enmap}${senderNumber}`, dataDir: './database'})
        }
        console.log(db)
        // if (senderNumber.includes("@g.us")) {
        //     var grup = await sock.groupMetadata(senderNumber);
        //     var db = new Enmap({name: `${process.env.enmap}${grup.id}`, dataDir: './database'})
        // }
        // else {
        //     var db = new Enmap({name: `${process.env.enmap}${senderNumber}`, dataDir: './database'})
        // }

        // const jids = []
        // if (db.get("prompt") == undefined) {
        //     db.set("prompt", [{role: "user", content: text}])
        // } else {
        //     db.push("prompt", {role: "user", content: text})
        // }
        // const [err, result] = await generateResponse(db.get("prompt"))
        // if (db.get("prompt").length > 10) {
        //     db.set(
        //         "prompt",
        //         db
        //             .get("prompt")
        //             .slice(
        //                 db.get("prompt").length - 10,
        //                 db.get("prompt").length
        //             )
        //     )
        // }
        // if (!err) {
        //     var pesan = result.content
        //     while (true) {
        //         if (pesan[0] == " ") var pesan = pesan.slice(1)
        //         else if (pesan[0] == "\n") var pesan = pesan.slice(1)
        //         else if (pesan.endsWith("\n"))
        //             var pesan = pesan.slice(0, pesan.length - 1)
        //         else break
        //     }
        //     db.push("prompt", result)
        //     if (pesan.includes("@")) {
        //         for (i of pesan.split("@")) {
        //             grup["participants"].map(async (usr) => {
        //                 if (!usr.id.includes(i.replace(/\D/g, ""))) {
        //                     jids.push(i.replace(/\D/g, "") + "@s.whatsapp.net")
        //                 }
        //             })
        //         }
        //         jids.splice(0, 1)
        //         var send = {text: pesan, mentions: jids}
        //     } else {
        //         var send = {text: pesan}
        //     }
        //     await sock.sendMessage(
        //         senderNumber,
        //         send,
        //         {quoted: messages[0]},
        //         1000
        //     )
        //     db.set("time", 10 * 60)
        // } else {
        //     await sock.sendMessage(
        //         senderNumber,
        //         {
        //             text: `The API is unreachable, please contact the API provider`,
        //         },
        //         {quoted: messages[0]},
        //         1000
        //     )
        // }

        // if (!waktuJalan && db.get("time") != undefined) {
        //     async function main() {
        //         const waktu = setInterval(() => {
        //             waktuJalan = true
        //             if (db.get("time") != 0) {
        //                 db.set("time", db.get("time") - 1)
        //             } else {
        //                 db.delete("time")
        //                 db.delete("prompt")
        //                 waktuJalan = false
        //                 clearInterval(waktu)
        //             }
        //         }, 1000)
        //     }
        //     main()
        // }
    },
}
