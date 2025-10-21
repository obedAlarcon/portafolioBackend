const jwt = require('jsonwebtoken')

const secret ='myProyect'
const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MjI1MzQ1N30.ZKr9-HUwbtVuNUvKQJhNoEDKLB3fFLh0TppZS5yDbNI'

function verifyToken(token, secret){
 return jwt.verify(token, secret)

}
const payload= verifyToken(token,secret)
console.log(payload)