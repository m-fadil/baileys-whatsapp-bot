require("dotenv").config()
const express = require("express")
var SimpleCrypto = require("simple-crypto-js").default

module.exports = {
    async execute(sock) {
        const app = express()
        const db = new Map()
        simpleCrypto = new SimpleCrypto(process.env.secret)
        
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
            next()
        })
        app.post("/api/codeVerif", async (req, res) => {
            const data = req.body
            res.send(await codeVerif(data.nomor))
        })
        app.post("/api/verif", async (req, res) => {
            const data = req.body
            res.send(await verif(data.nomor, data.code))
        })
        app.post("/api/chat", async (req, res) => {
            const data = req.body
            res.send(await chat(data.id, data.text, data.pembuat))
        })
        app.get('/', (req, res) => res.send('Uptime!'));
        app.listen(3000, () => {
            console.log("Server berjalan di http://localhost:3000")
        })

        async function codeVerif(nomor) {
            let adakah = false
            const allGrup = await sock.groupFetchAllParticipating()
            for await (let key of Object.keys(allGrup)) {
                for (let usr of allGrup[key].participants){
                    if (usr.id == `${nomor}@s.whatsapp.net`) {
                        adakah = true
                        break
                    }
                    if (adakah) break
                }
            }
            if (adakah) {
                let rdm = Math.floor(Math.random() * 99999).toString()
                let rawId = "0".repeat(5 - rdm.length) + rdm
                db.set(rawId, {time: 5 * 60, end: false}) //m - s - ms
                const sesi = setInterval(async () => {
                    if (db.get(rawId) != 0 && !db.get(rawId).end) {
                        db.set(rawId, {time: db.get(rawId).time - 1, end: db.get(rawId).end})
                    }
                    else {
                        db.delete(rawId)
                        clearInterval(sesi)
                    }
                }, 1000)
                await sock.sendMessage(
                    `${nomor}@s.whatsapp.net`,
                    {text: `kode verifikasi anda:\n\n*${rawId}*`},
                    1000
                )
            }
            return adakah
        }

        async function verif(nomor, code) {
            if (db.has(code)) {
                db.set(code, {time: db.get(code).time, end: true})
                //fetch all grup yang bersama
                let dump = []
                const allGrup = await sock.groupFetchAllParticipating()
                for await (let key of Object.keys(allGrup)) {
                    for (let usr of allGrup[key].participants){
                        if (usr.id == `${nomor}@s.whatsapp.net`) {
                            dump.push({
                                subject: allGrup[key].subject,
                                id: simpleCrypto.encrypt(allGrup[key].id)
                            })
                            break
                        }
                    }
                }
                return dump
            }
            else {
                return false
            }
        }
        
        async function chat(id, text, nama) {
            if (nama == null || nama == '') nama='anonim'
            if (!nama.startsWith('~')) nama = `~${nama}`
            id = simpleCrypto.decrypt(id)
            text = `${text}\n\n${nama}`
            await sock.sendMessage(
                id,
                {text: text},
                1000
            )
            return true
        }
    },
}