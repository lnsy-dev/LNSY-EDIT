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
const Pinboard = require('node-pinboard').default;


const dotenv = require("dotenv")
dotenv.config()



let PORT = process.env.PORT
if(!PORT){
  PORT = 3000
}

let PINBOARD_KEY = process.env.PINBOARD_API_TOKEN
if(!PINBOARD_KEY){
  console.log('NO PINBOARD TOKEN. QUITTING')
  return
}

const pinboard = new Pinboard(PINBOARD_KEY);

pinboard.all({  }, (err, res) => {
  console.log(res);
  //date: date,
  //user: 'user',
  //posts:
  //[ { href: 'https://github.com/maxmechanic/node-pinboard',
  //description: 'node pinboard',
  //extended: '',
  //meta: 'meta',
  //hash: 'hash',
  //time: 'time',
  //shared: 'no',
  //toread: 'yes',
  //tags: 'git node-pinboard test' } ] }
});


// /*

//   APP USE

//   More on .use here: https://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps

//   Mostly for declaring which resources are available to clients

// */

// app.use(express.json())

// app.use('/', express.static(`${__dirname}`))
// app.use('/files', express.static(`${__dirname}/files`))


// // let sessions = {

// // }



// app.get('/',(req,res) => { 
//   res.sendFile(`${__dirname}/files.html`)
// })

// app.get('/list', (req, res) => {
//   console.log(req, res)



// })



// app.listen(PORT,() => { 
//     console.log(`Running on PORT ${PORT}`)
// }) 
