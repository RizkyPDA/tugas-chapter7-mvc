const express = require('express')
const app = express()
const router = express.Router()
const user = require('../controllers/controller')

app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static(__dirname + "/public/"))

router.get('/', user.about)

module.exports = router