const express = require('express')
const app = express()
const router = require('./routes/router')

//share static file
app.set("views", "./views")
app.use(express.static(__dirname + "/public/"))
app.set("view engine", "ejs")

//call router
app.use(router)

//connecting to local server
const PORT = 5000
app.listen(PORT, () => {
	console.log(`Client is listening at port ${PORT}`)
})