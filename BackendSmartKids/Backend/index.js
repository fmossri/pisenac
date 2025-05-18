const bodyParser = require('body-parser')
const express = require("express")
const app = express()
const router = require("./routes/routes")
const port = 3001

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use("/",router);

app.listen(port,() => {
    console.log(`Servidor rodando... endereço http://localhost:${port}`)
});
