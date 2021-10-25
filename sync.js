/*
  *** begin ascii art ***

          ,a8a,
         ,8" "8,                       8I
         d8   8b                       8I
         88   88                       8I
         88   88                       8I
         Y8   8P  ,ggg,,ggg,     ,gggg,8I   ,ggg,      ,gg,   ,gg
         `8, ,8' ,8" "8P" "8,   dP"  "Y8I  i8" "8i    d8""8b,dP"
    8888  "8,8"  I8   8I   8I  i8'    ,8I  I8, ,8I   dP   ,88"
    `8b,  ,d8b, ,dP   8I   Yb,,d8,   ,d8b, `YbadP' ,dP  ,dP"Y8,
      "Y88P" "Y88P'   8I   `Y8P"Y8888P"`Y8888P"Y8888"  dP"   "Y88

  *** end ascii art ***

  index.js,

  This is to wire together components and prototype quick ideas, not run the 
  business logic.

  Software is, above all things, a human / computer interface. This bundle of 
  text is your interface between the server and you: keep it clear and humane.

*/



const express = require( 'express' )
const app = express()
const server = require( 'http' ).Server( app )
const axios = require('axios').default;


const dotenv = require("dotenv")
dotenv.config()



let PORT = process.env.PORT
if(!PORT){
  PORT = 3000
}

let EDIT_KEY = process.env.EDIT_KEY
if(!EDIT_KEY){
  EDIT_KEY = 'EDITOR'
}



/*

  APP USE

  More on .use here: https://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps

  Mostly for declaring which resources are available to clients

*/

app.use(express.json())

app.use('/', express.static(`${__dirname}`))
app.use('/files', express.static(`${__dirname}/files`))


// let sessions = {

// }

const GUN = require('gun')
const gun = new GUN(['https://yggdras1l.herokuapp.com/gun'])
const user = gun.user()

const DATAROOM_KEY = process.env.DATAROOM_KEY
const DATAROOM_SECRET = process.env.DATAROOM_SECRET

user.create(DATAROOM_KEY, DATAROOM_SECRET, function(awk){
  console.log(awk)
  user.auth(DATAROOM_KEY, DATAROOM_SECRET, function(_awk){
    console.log(_awk)
  })
})



const chokidar = require('chokidar');

const watcher = chokidar.watch(`${__dirname}/files`, {ignored: /^\./, persistent: false});

watcher
  .on('add', function(path) {
    gun.get(DATAROOM_KEY).get('FILE_UPDATE').get(Date.now()).get('FILE-ADDED').set(path)

  })
  .on('change', function(path) {
    gun.get(DATAROOM_KEY).get('FILE_UPDATE').get(Date.now()).get('FILE-CHANGED').set(path)

  })
  .on('unlink', function(path) {
    gun.get(DATAROOM_KEY).get('FILE_UPDATE').get(Date.now()).get('FILE-REMOVED').set(path)

  })
  .on('error', function(error) {
    gun.get(DATAROOM_KEY).get('FILE_UPDATE').get(Date.now()).get('FILE-ERROR').set(error)

  })


app.get('/',(req,res) => { 
  res.cookie('dtrm', JSON.stringify({
    DATAROOM_KEY:DATAROOM_KEY,
    DATAROOM_SECRET:DATAROOM_SECRET
  }))

  res.sendFile(`${__dirname}/sync.html`)
})

app.listen(PORT,() => { 
    console.log(`Running on PORT ${PORT}`)
}) 
