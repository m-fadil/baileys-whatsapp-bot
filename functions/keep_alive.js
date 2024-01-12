import express from "express"

const app = express()

app.get('/', (req, res) => res.send('Uptime!')).listen(8080);