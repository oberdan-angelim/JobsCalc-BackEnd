// module express to create a server
const express = require("express"); 
const server = express()
const routes = require('./routes')

// template engine (view engine)
server.set('view engine', 'ejs')

// usar o req body
// o USE() é utilizado para habilitar configurações do servidor!
server.use(express.urlencoded({ extended: true }))

//colocando os arquivos estáticos (normalmente imagens)
server.use(express.static('public'));
//aplicando todas as rotas
server.use(routes);

// ouvindo o server, criando a porta para criar o localhost:port
server.listen(3000, () => {
    console.log("Server is running on port 3000")
})

// using request and response to get the index.html in lolcalhost:port */* 
/* server.get("/", (req, res) => {
    return res.sendFile(__dirname + "/views/index.html")}) */
