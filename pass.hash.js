const bcrypt = require('bcrypt')

async function hashPassword(){
    const myPassword= 'admin123'// esta password es la misma que enviamos a passverify 
    // aqui creamos el ajemplo y corremos para obtenes la paswprd encriptada 
    const hash=await bcrypt.hash(myPassword,10) //creamos la variable y el 10 es el numero de saltos las veces que se encripta
    console.log(hash)
}
hashPassword(); 
// con este archivo creamos la password encriptada y la llevamos hasta el archivo passverify
