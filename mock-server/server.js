const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

// Express server
const server = jsonServer.create()
const router = jsonServer.router('mock-server/db.json')
const userdb = JSON.parse(fs.readFileSync('mock-server/users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

// SECRET_KEY is used to sign the payloads and expiresIn for
// setting the time of expiration for JWT access tokens.
const SECRET_KEY = '123456789'
const expiresIn = '1h'

// Create a token from a payload
function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token
function verifyToken(token) {
  return  jwt.verify(token, 
      SECRET_KEY, 
      (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}) {
  return userdb.users.findIndex(
      user => user.email === email && user.password === password) 
        !== -1
}

// LoginPage to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;
  if (isAuthenticated({email, password}) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }

  let role = '';
  let name= '';
  for (var user of userdb.users) {
      if (user.email === email) {
        role = user.role;
        name = user.name;
      }
  }

  const access_token = createToken({email, password, role, name})
  console.log("Access Token: " + access_token);
  res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined 
      || req.headers.authorization.split(' ')[0] 
      !== 'Bearer') {

    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = 
          verifyToken(req.headers.authorization.split(' ')[1]);

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(8000, () => {
  console.log('Run Mock API Server')
})

