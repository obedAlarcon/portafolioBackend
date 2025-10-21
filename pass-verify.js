const bcrypt= require('bcrypt')
// aqui validamos que tanto las passwors normal y la password hascheada esten bien 
async function verifyPassword(){
    const myPassword ='admin123'
    const hash ='$2b$10$Us8ehxsaR942C3WNsFY4lOTof4E5DgPjSPU9Ka1aqVeNC.XYRe1gu'
    const isMatch =await bcrypt.compare(myPassword, hash)
    console.log(isMatch)
}
verifyPassword();