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

const NeoCities = require('neocities')
const api_1 = new NeoCities(process.env.NEOCITIES_ONE, process.env.NEOCITIES_PW)


 



app.get('/',(req,res) => { 
  res.sendFile(`${__dirname}/files.html`)
})

app.get('/list', (req, res) => {
  console.log(req, res)

  axios.get(`https://${process.env.NEOCITIES_ONE}:${process.env.NEOCITIES_PW}@neocities.org/api/list`)
  .then(function (response) {
    // handle success
    res.send(response.data.files)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })


})



// const isValidPhoneNumber = require(__dirname + '/server/phone-number-check.js')
// const sendOneTimeCode = require(__dirname + '/server/one-time-code.js')
// app.get('/verify/:phonenumber', (req, res) => {
//   const phone_number = req.params.phonenumber
//   isValidPhoneNumber(phone_number).then(response => {
//     const session_id = sendOneTimeCode(phone_number)
//     sessions[session_id] = {
//       SESSION_ID: session_id,
//       SESSION_KEY: helpers.getNewID(),
//       USER_UPLOAD_KEY: helpers.getNewID(),
//       PUBLIC_KEY: process.env.DATAROOM_KEY,
//       STATUS: 'UNCLAIMED'
//     }

//     console.log(session_id)
//   }).catch(e => console.log(e))
// })

// const getSignedUrl = require(__dirname + '/server/s3-upload.js')
// app.get(`/${process.env.UPLOAD_KEY}`, async (req, res) => {
//   res.send.json(await getSignedUrl())
// })

// app.get('/:dataroomkey', (req, res) => {
//   const dtrm_key = req.params.dataroomkey
//   const session = sessions[dtrm_key]
//   if(typeof(sessions[dtrm_key]) !== 'undefined' 
//   && session.STATUS !== 'CLAIMED'){
//     // @todo: remove the following line to enforce one login per dataroom key
//     // session.STATUS = 'CLAIMED'
//     res.cookie('dtrm', JSON.stringify(session));
//     res.sendFile(`${__dirname}/client/logged-in.html`)
//   } else {
//     res.status(401).sendFile(`${__dirname}/client/login.html`)    
//   }
// })


app.listen(PORT,() => { 
    console.log(`Running on PORT ${PORT}`)
}) 
