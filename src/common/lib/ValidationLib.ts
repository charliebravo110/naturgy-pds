import MasterDataResult from '../interfaces/MasterDataResult';
import MasterDataService from '../services/MasterDataService';

export function validateMail(email: string): boolean {
  const emailRegExpr = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/
  const emailNotValid = /@(no|a)\.(es|com)/
  if(emailRegExpr.test(email) && !emailNotValid.test(email.toLocaleLowerCase())){
    return true
  }else{
    return false
  }
}

//1016316 GENERACION
export async function getCupsGenerationValue(): Promise<Array<string>> {
  try {
    let masterData = new MasterDataService();
    let generationValueJson = await masterData.getUniqueValue('MASTER', 'SR_CUPS_GENERACION', 'ES');
    let generationValue = JSON.parse(generationValueJson);
    return generationValue;
  } catch (error) {
    console.error('Error al obtener los valores de la base de datos:', error);  
    throw error; 
  }
}
//1016316 CONSUMO
export async function getCupsConsumoValue(): Promise<Array<string>> {
  try {
    let masterData = new MasterDataService();
    let generationValueJson = await masterData.getUniqueValue('MASTER', 'SR_CUPS_CONSUMO', 'ES');
    let generationValue = JSON.parse(generationValueJson);

    return generationValue;
  } catch (error) {
    console.error('Error al obtener los valores de la base de datos:', error);  
    throw error; 
  }
}



export async function validateMailParam(email: string): Promise<boolean> {
  let masterData = new MasterDataService();

  let paramStringEmail = await masterData.getUniqueValue('MASTER', 'PARAM_EMAIL', 'ES')
  const emailRegExpr = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/

  if(emailRegExpr.test(email)){
    let boolControl = true
    const listParam = paramStringEmail.split(',')
    for (let i = 0; i <= listParam.length; i++){
      boolControl = !email.includes(listParam[i]);
  

      if(!boolControl){
        break;
      }
    }
    return boolControl
  }else{
    return false
  }
}

//1024384 Mejorar procesos area privada
export async function validateMailParamTele(email: string): Promise<boolean> {
  let masterData = new MasterDataService();

  let paramStringEmail = await masterData.getUniqueValue('MASTER', 'PARAM_EMAIL_TELE', 'ES')
    let boolControl = true
    const listParam = paramStringEmail.split(',')
    for (let i = 0; i <= listParam.length; i++){
  
      boolControl = email.includes(listParam[i]);

      if(boolControl){
        break;
      }
    }
    return boolControl
  
  }

export async function validateMobileNumberParam(mobile: string): Promise<boolean> {
  let masterData = new MasterDataService();
  let paramStringNumber = await masterData.getUniqueValue('MASTER', 'PARAM_PHONE', 'ES')
  const mobileRegExp =/^[0-9]{9}$/
  
    if(mobile[0] === '6' || mobile[0] === '7'){
      if(mobileRegExp.test(mobile)){
        let boolControl = true
      const listParam = paramStringNumber.split(',')
      for (let i = 0; i <= listParam.length; i++){
        boolControl = !mobile.includes(listParam[i]);
        if(!boolControl){
          break;
        }
      }
      return boolControl
    }else{
      return false
    }
  }

  //return (mobile[0] === '6' || mobile[0] === '7') && /^[0-9]{9}$/.test(mobile)
}







const LETTERS = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E']
const NIE_LETTERS = ['X', 'Y', 'Z']
const NIE_LETTER_TO_NUMBER = {
  X: 0,
  Y: 1,
  Z: 2
}

export function validateIdentityCard(id: string): boolean {
  id = id.toUpperCase()

  const isValidCif = validateCIF(id)
  const isValidNie = validateNIE(id)
  const isValidNif = validateNIF(id)

  return isValidCif || isValidNie || isValidNif
}
export function validateIdentityCardAmpl(id: string): boolean {
  id = id.toUpperCase()

  const isValidCif = validateCIF(id)
  const isValidNie = validateNIE(id)
  const isValidNif = validateNIF(id)
  const isValidCode = validateUserCode(id)

  return isValidCif || isValidNie || isValidNif || isValidCode
}
export function validateIdentityCardAmplNew(id: string, emailTele:boolean): boolean {
  id = id.toUpperCase()


  if(!emailTele){
    const isValidCif = validateCIF(id)
    const isValidNie = validateNIE(id)
    const isValidNif = validateNIF(id)
    return isValidCif || isValidNie || isValidNif

  }else{

    const isValidCode = validateUserCode(id)
    return  isValidCode

  }
 
}
//1024384 Mejorar procesos area privada

export function validateTele(code: string): boolean {
  code = code.toUpperCase()
  
  const code9 = /^9\d{7}$/.test(code)
  const code70 = /^70\d{6}$/.test(code)
  
  return code9 || code70
}
export function validateUserCode(code: string): boolean {
  code = code.toUpperCase()
  
  const code9 = /^9\d{7}$/.test(code)
  const code00 = /^00\d{6}$/.test(code)
  const code44 = /^44\d{6}$/.test(code)
  const code70 = /^70\d{6}$/.test(code)
  const codeUF = /^UF\d{6}$/.test(code) || /^uf\d{6}$/.test(code)
  
  return code9 || code00 || code44 || code70 || codeUF
}
  //1024384 Mejorar procesos area privada
export function validateUserCodeSignUp(code: string): boolean {
  code = code.toUpperCase()
  
  const code9 = /^9\d{5}$/.test(code)
  const code00 = /^00\d{6}$/.test(code)
  const code44 = /^44\d{6}$/.test(code)
  const code70 = /^70\d{6}$/.test(code)
  
  return code9 || code00 || code44 || code70 
}
export function phoneEmpty(phone: string): string {
  if(phone===''){
    return'600000000'
  }else{
    return phone
  }
}

export function validateCIF(id: string): boolean {
  id = id.toUpperCase()

  if (!id || id.length !== 9) {
    return false
  }

  const letters = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
  const digits = id.substr(1, id.length - 2)
  const letter = id.substr(0, 1)
  const control = id.substr(id.length - 1)
  let sum = 0
  let digit = 0

  if (!letter.match(/[A-Z]/)) {
    return false
  }

  for (let i = 0; i < digits.length; ++i) {
    digit = parseInt(digits[i])

    if (isNaN(digit)) {
      return false
    }

    if (i % 2 === 0) {
      digit *= 2
      if (digit > 9) {
        //~~ Convert a float into a int without rounding
        digit = ~~(digit / 10) + (digit % 10)
      }

      sum += digit
    } else {
      sum += digit
    }
  }

  sum %= 10;
  if (sum !== 0) {
    digit = 10 - sum
  } else {
    digit = sum
  }

  if (letter.match(/[ABEH]/)) {
    return String(digit) === control
  }
  if (letter.match(/[NPQRSW]/)) {
    return letters[digit] === control
  }

  return String(digit) === control || letters[digit] === control
}

export function validateNIE(id: string): boolean {
  id = id.toUpperCase()

  if (NIE_LETTERS.includes(id[0])) {
    id = `${NIE_LETTER_TO_NUMBER[id[0]]}${id.substring(1)}`
    return validateNIF(id)
  } else {
    return validateCIF(id)
  }
}

export function validateNIF(id: string): boolean {
  id = id.toUpperCase()

  if (id.length === 8) {
    id = '0' + id
  }

  if (!(/^\d{8}[A-Z]$/.test(id))) {
    return false
  }

  const idLetter = id.substring(8, 9).toUpperCase()
  const idNumber = Number(id.substring(0, 8))
  const calculatedletter = LETTERS[idNumber % 23]  
  return idLetter === calculatedletter
}
//aqui
export function validateMobileNumberDoc(mobile: string, document: string ): boolean {
  const telegestion = validateUserCode(document);
  const mobileRegExp =/^[0-9]{9}$/
  const mobileRep= /^(\d)\1{8}$/
  if(telegestion){
    return true
  }else{
    if(mobile[0] === '6' || mobile[0] === '7'){
      if(mobileRegExp.test(mobile) && !mobileRep.test(mobile)){
        return true
      }else{
        return false
      }
    }
  }

  //return (mobile[0] === '6' || mobile[0] === '7') && /^[0-9]{9}$/.test(mobile)
}

export function validateMobileNumber(mobile: string): boolean {
  const mobileRegExp =/^[0-9]{9}$/
  const mobileRep= /^(\d)\1{8}$/
 
    if(mobile[0] === '6' || mobile[0] === '7'){
      if(mobileRegExp.test(mobile) && !mobileRep.test(mobile)){
        return true
      }else{
        return false
      }
    }
  }

  //return (mobile[0] === '6' || mobile[0] === '7') && /^[0-9]{9}$/.test(mobile)


export function validatePhoneNumber(phone: string): boolean {
  return /^[0-9]{9}$/.test(phone)
}

export function validatePassword(password: string): boolean {
  return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9@#!$%^&*]{10,12}$/.test(password)


}
//VALIDACION NUMERO
//Aui
export function newValidatePasswordNumber(password: string): boolean {
  // Devuelve 'true' si el password contiene numeros
  const hasNumber = /(?=.*\d|[^\wñç]).+/.test(password);
  if(!newValidatePassSpace(password)){
    return false
  }else{
    // const hasNumber = /\d/.test(password)
  if (hasNumber) {
    return true
  }
  else {
    return false
  }

  }

  
}
//-------------------------
//VALIDADCION 8-12
export function newValidatePasswordNumberCharacter(password: string): boolean {
  // Devuelve 'true' si el password contiene entre 10 y 12 carácteres, incluyendo alguna minúscula, mayúscula y número
  const firstValidation = /^.{10,12}$/.test(password)
  if (firstValidation) {
    return true
  }
  else {
    return false
  }
}
//VALIDACION MAYUSCULA
export function newValidatePasswordCapital(password: string): boolean {
  // Devuelve 'true' si el password contiene entre 8 y 12 carácteres, incluyendo alguna minúscula, mayúscula y número
  const firstValidation = /(.*[A-Z])/.test(password)
  if (firstValidation) {
    return true
  }
  else {
    return false
  }
}
//VALIDACION MINUCULA
export function newValidatePasswordLower(password: string): boolean {
  // Devuelve 'true' si el password contiene entre 8 y 12 carácteres, incluyendo alguna minúscula, mayúscula y número
  const firstValidation = /(.*[a-z])/.test(password)
  if (firstValidation) {
    return true
  }
  else {
    return false
  }
}
//Aqui
//VALIDACION ESPACIOS (LOS CARACTER ESPECIALES SON LAS EXPRESION COMENTADA)
export function newValidatePassSpace(password: string): boolean {
  // Devuelve 'true' si el password no contiene espacios o caracter especial
  const firstValidation = /^[^\sñç]+$/.test(password);

  // const firstValidation = /^[^\s]+$/.test(password)
  //const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); 
  //const firstValidation = /^[^\s!@#$%^&*~(),+-.`?":={_}|<>ñÑçÇ]+$/.test(password);
  if (firstValidation) {
    return true
  }
  else {
    return false
  }
}

//SIN NATURGY O UFD
export function newValidatePasswordLetter(password: string): boolean {
 
  // Devuelve 'true' si el password contiene las palabras 'naturgy' o 'ufd'
  const forbiddenWords = ((password.toUpperCase().includes('NATURGY')) || (password.toUpperCase().includes('UFD'))) ? true : false

  // La función devuelve TRUE únicamente si todas las validaciones se realizan correctamente
  if (!forbiddenWords) {
    return true
  }
  else {
    return false
  }
}
//SIN COINCIDENCIAS DE DATOS FACILITADOS
export function newValidatePasswordCoincidence(password: string, name: string, surname: string, documentNumber: string, phone: string, email: string): boolean {

  let validationName = false
  let validationSurname =false
  let validationDoc =false
  let validationPhone =false
  let validationEmail =false


  // Validación para comprobar si la constraseña contiene parte del nombre de usuario
  if (name) {
    validationName = password.includes(name)
    }    
  
  // Validación para comprobar si la constraseña contiene parte del apellido o razon social de usuario
  if (surname) {
      validationSurname = password.includes(surname)
  }
  // Validación para comprobar si la constraseña contiene parte del documento de usuario
  if (documentNumber) {
      validationDoc = password.includes(documentNumber)
     
  }
  // Validación para comprobar si la constraseña contiene parte del telefono de usuario
  // 1024384 Mejorar procesos area privada
  
    if (phone) {
      validationPhone = password.includes(phone)
    } 
  
  
  // Validación para comprobar si la constraseña contiene parte del email de usuario
  if (email) {
    validationEmail= password.includes(email)
  }  


  // La función devuelve TRUE únicamente si todas las validaciones se realizan correctamente
  if (!validationName && !validationSurname && !validationDoc  && !validationPhone && !validationEmail) {
    return true
  }
  else {
    return false
  }
}
//SIN CARACTER REPETITIVO
export function newValidatePasswordConsecutive(password: string): boolean {
  // Contenadrá 'true' si la contraseña contiene números consecutivos. Ejemplo: (123) => TRUE, (12356) => FALSE
  let consecutiveNumbersValidation = false
  // Contenadrá 'true' si la contraseña contiene 3 o más letras consecutivas. Ejemplo: (abc) => TRUE, (abd) => FALSE 
  let consecutiveLettersValidation = false
   // Contenadrá 'true' si la contraseña contiene números capicua. Ejemplo: (121) => TRUE, (125) => FALSE
   let palindromicNumbersValidation = false
   // Contenadrá 'true' si la contraseña contiene 3 o más letras capicua. Ejemplo: (aba) => TRUE, (abd) => FALSE 
   let palindromicLettersValidation = false
   // Contenadrá 'true' si la contraseña contiene númeroso texto repetidos. Ejemplo: (111) => TRUE, (125) => FALSE
   let repetitiveValidation = false
  

  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let lastAlphabetIndex = 0
  let lastNumbersIndex = 0
  let consecutiveLettersCount = 0
  let consecutiveNumbersCount = 0
  
  const passwordArray = password.split(/([0-9]+)/)

  // Validación para comprobar si la contraseña contiene números consecutivos en orden (Ej: 12345)
  const regexConsecutivo= (/([\s\S])\1\1/)
  if(regexConsecutivo.test(password)){
    repetitiveValidation =true
  }


  passwordArray.map((characters, i) => {
    // Validación para comprobar si la contraseña contiene números consecutivos en orden (Ej: 12345)
    if (characters !== '' && characters.length >= 3 && characters.match(/[0-9]/i)) {
      const numericCharacters = characters.split('')
      numericCharacters.map((singleNumber, i) => {
        const indexOfNumber = numbers.indexOf(singleNumber)
        if (indexOfNumber !== -1) {
          if (i > 0 && indexOfNumber === lastNumbersIndex + 1) {
            consecutiveNumbersCount += 1
          }
          else {
            consecutiveNumbersCount = 0
          }
          lastNumbersIndex = indexOfNumber            
        }
        else {
          consecutiveNumbersCount = 0
        }


        if (consecutiveNumbersCount >= 2) {
          consecutiveNumbersValidation = true
        }
      })
      if (numericCharacters[0] === numericCharacters[2]) 
      {
        palindromicNumbersValidation=true
      }
    }
    // Validación para comprobar si la contraseña contiene 3 o más letras consecutivas en orden alfabético (Ej: abc)
    else if (characters !== '' && characters.length >= 3 && !characters.match(/[0-9]/i)) {
      const languageCharacters = characters.split('')
      languageCharacters.map((singleCharacter, i) => {
        if ((/[a-zA-Z]/).test(singleCharacter)) {
          const actualCharacter = singleCharacter.toUpperCase()
          const indexOfLetter = alphabet.indexOf(actualCharacter)
          if (indexOfLetter !== -1) {
            if (i > 0 && indexOfLetter === lastAlphabetIndex + 1) {
              consecutiveLettersCount += 1
            }
            else {
              consecutiveLettersCount = 0
            }
            lastAlphabetIndex = indexOfLetter            
          }
          else {
            consecutiveLettersCount = 0
          }
        }
        else {
          consecutiveLettersCount = 0
          lastAlphabetIndex = -1
        }


        if (consecutiveLettersCount >= 2) {
          consecutiveLettersValidation = true
        }
      })
      if (languageCharacters[0] === languageCharacters[2])
      {
        palindromicLettersValidation=true
      }
    }
  })

  // La función devuelve TRUE únicamente si todas las validaciones se realizan correctamente
  if (!consecutiveNumbersValidation && !consecutiveLettersValidation && !palindromicLettersValidation && !palindromicNumbersValidation && !repetitiveValidation ) {
    return true
  }
  else {
    return false
  }
}
//--------------------------------------------

export function newValidatePassword(password: string, user: string): boolean {
  // Devuelve 'true' si el password contiene entre 10 y 12 carácteres, incluyendo alguna minúscula, mayúscula, número 
  // y opcionalmente un carácter especial (@, #, !)
  const firstValidation = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9@#!$%^&*]{10,12}$/.test(password)
  // Devuelve 'true' si el password contiene 3 o más carácteres consecutivos repetidos (111, aaa, etc)
  const secondValidation = /([\s\S])\1\1/.test(password)
  // Devuelve 'true' si el password no contiene espacios
  const thirdvalidation = /^[^\s]+$/.test(password)
  // Contendrá 'true' si no se le pasa el usuario a la función o si se verifica que la contraseña NO contiene la primera parte del nombre de usuario
  let userValidation1 = false
  // Contendrá 'true' si no se le pasa el usuario a la función o si se verifica que la contraseña NO contiene la segunda parte del nombre de usuario
  let userValidation2 = false
  // Devuelve 'true' si el password contiene las palabras 'naturgy' o 'ufd'
  const forbiddenWords = ((password.toUpperCase().includes('NATURGY')) || (password.toUpperCase().includes('UFD'))) ? true : false
  // Contenadrá 'true' si la contraseña contiene números consecutivos. Ejemplo: (12345) => TRUE, (12356) => FALSE
  let consecutiveNumbersValidation = false
  // Contenadrá 'true' si la contraseña contiene 3 o más letras consecutivas. Ejemplo: (abc) => TRUE, (abd) => FALSE 
  let consecutiveLettersValidation = false

  // Validación para comprobar si la constraseña contiene parte del nombre de usuario
  if (user) {
    if (user.length >= 4) {
      userValidation1 = password.includes(user.substring(0, 4))
    }

    if (user.length >= 8) {
      userValidation2 = password.includes(user.substring(4, 8))
    }    
  }

  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let lastAlphabetIndex = 0
  let lastNumbersIndex = 0
  let consecutiveLettersCount = 0
  let consecutiveNumbersCount = 0
  
  const passwordArray = password.split(/([0-9]+)/)
  passwordArray.map((characters, i) => {
    // Validación para comprobar si la contraseña contiene números consecutivos en orden (Ej: 12345)
    if (characters !== '' && characters.length >= 4 && characters.match(/[0-9]/i)) {
      const numericCharacters = characters.split('')
      numericCharacters.map((singleNumber, i) => {
        const indexOfNumber = numbers.indexOf(singleNumber)
        if (indexOfNumber !== -1) {
          if (i > 0 && indexOfNumber === lastNumbersIndex + 1) {
            consecutiveNumbersCount += 1
          }
          else {
            consecutiveNumbersCount = 0
          }
          lastNumbersIndex = indexOfNumber            
        }
        else {
          consecutiveNumbersCount = 0
        }

        if (consecutiveNumbersCount >= 3) {
          consecutiveNumbersValidation = true
        }
      })
    }
    // Validación para comprobar si la contraseña contiene 3 o más letras consecutivas en orden alfabético (Ej: abc)
    else if (characters !== '' && characters.length >= 4 && !characters.match(/[0-9]/i)) {
      const languageCharacters = characters.split('')
      languageCharacters.map((singleCharacter, i) => {
        if ((/[a-zA-Z]/).test(singleCharacter)) {
          const actualCharacter = singleCharacter.toUpperCase()
          const indexOfLetter = alphabet.indexOf(actualCharacter)
          if (indexOfLetter !== -1) {
            if (i > 0 && indexOfLetter === lastAlphabetIndex + 1) {
              consecutiveLettersCount += 1
            }
            else {
              consecutiveLettersCount = 0
            }
            lastAlphabetIndex = indexOfLetter            
          }
          else {
            consecutiveLettersCount = 0
          }
        }
        else {
          consecutiveLettersCount = 0
          lastAlphabetIndex = -1
        }

        if (consecutiveLettersCount >= 3) {
          consecutiveLettersValidation = true
        }
      })
    }
  })

  // La función devuelve TRUE únicamente si todas las validaciones se realizan correctamente
  if (firstValidation && !secondValidation && thirdvalidation && !userValidation1 && !userValidation2 && !forbiddenWords && !consecutiveNumbersValidation && !consecutiveLettersValidation) {
    return true
  }
  else {
    return false
  }
}

export function newValidatePassword700(password: string, user: string): boolean {
  // Devuelve 'true' si el password contiene entre 10 y 12 carácteres, incluyendo alguna minúscula, mayúscula y número
  const firstValidation = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{10,12}$/.test(password)
  // Devuelve 'true' si el password contiene 3 o más carácteres consecutivos repetidos (111, aaa, etc)
  const secondValidation = /([\s\S])\1\1/.test(password)
  // Contendrá 'true' si no se le pasa el usuario a la función o si se verifica que la contraseña NO contiene la primera parte del nombre de usuario
  let userValidation1 = false
  // Contendrá 'true' si no se le pasa el usuario a la función o si se verifica que la contraseña NO contiene la segunda parte del nombre de usuario
  let userValidation2 = false
  // Devuelve 'true' si el password contiene las palabras 'naturgy' o 'ufd'
  const forbiddenWords = ((password.toUpperCase().includes('NATURGY')) || (password.toUpperCase().includes('UFD'))) ? true : false
  // Contenadrá 'true' si la contraseña contiene números consecutivos. Ejemplo: (12345) => TRUE, (12356) => FALSE
  let consecutiveNumbersValidation = false
  // Contenadrá 'true' si la contraseña contiene 3 o más letras consecutivas. Ejemplo: (abc) => TRUE, (abd) => FALSE 
  let consecutiveLettersValidation = false

  // Validación para comprobar si la constraseña contiene parte del nombre de usuario
  if (user) {
    if (user.length >= 4) {
      userValidation1 = password.includes(user.substring(0, 4))
    }

    if (user.length >= 8) {
      userValidation2 = password.includes(user.substring(4, 8))
    }    
  }

  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  let lastAlphabetIndex = 0
  let lastNumbersIndex = 0
  let consecutiveLettersCount = 0
  let consecutiveNumbersCount = 0
  
  const passwordArray = password.split(/([0-9]+)/)
  passwordArray.map((characters, i) => {
    // Validación para comprobar si la contraseña contiene números consecutivos en orden (Ej: 12345)
    if (characters !== '' && characters.length >= 4 && characters.match(/[0-9]/i)) {
      const numericCharacters = characters.split('')
      numericCharacters.map((singleNumber, i) => {
        const indexOfNumber = numbers.indexOf(singleNumber)
        if (indexOfNumber !== -1) {
          if (i > 0 && indexOfNumber === lastNumbersIndex + 1) {
            consecutiveNumbersCount += 1
          }
          else {
            consecutiveNumbersCount = 0
          }
          lastNumbersIndex = indexOfNumber            
        }
        else {
          consecutiveNumbersCount = 0
        }

        if (consecutiveNumbersCount >= 3) {
          consecutiveNumbersValidation = true
        }
      })
    }
    // Validación para comprobar si la contraseña contiene 3 o más letras consecutivas en orden alfabético (Ej: abc)
    else if (characters !== '' && characters.length >= 4 && !characters.match(/[0-9]/i)) {
      const languageCharacters = characters.split('')
      languageCharacters.map((singleCharacter, i) => {
        if ((/[a-zA-Z]/).test(singleCharacter)) {
          const actualCharacter = singleCharacter.toUpperCase()
          const indexOfLetter = alphabet.indexOf(actualCharacter)
          if (indexOfLetter !== -1) {
            if (i > 0 && indexOfLetter === lastAlphabetIndex + 1) {
              consecutiveLettersCount += 1
            }
            else {
              consecutiveLettersCount = 0
            }
            lastAlphabetIndex = indexOfLetter            
          }
          else {
            consecutiveLettersCount = 0
          }
        }
        else {
          consecutiveLettersCount = 0
          lastAlphabetIndex = -1
        }

        if (consecutiveLettersCount >= 3) {
          consecutiveLettersValidation = true
        }
      })
    }
  })

  // La función devuelve TRUE únicamente si todas las validaciones se realizan correctamente
  if (firstValidation && !secondValidation && !userValidation1 && !userValidation2 && !forbiddenWords && !consecutiveNumbersValidation && !consecutiveLettersValidation) {
    return true
  }
  else {
    return false
  }
}

export function calculatePassworStrength(password: string): string {
  return 'low'
}

export function validateCupsNumber(cups: string): boolean {
  if (cups.length === 21) {
    cups += 'P'
  }

  if (cups.length === 20) {
    cups += '1P'
  }
  
  if (!/^[A-Z]{2}[0-9]{4}[0-9]{12}[A-Z]{2}[0-9]?[A-Z]?$/.test(cups)) {
    // Expresion: LL DDDD CCCC CCCC CCCC EE (NT)?

    return false
  }

  if (!(cups.startsWith('ES0022') || cups.startsWith('ES0390'))) {
    return false;
  }

  if (!cups.endsWith('1P')) {
    return false;
  }

  const idNumber = Number(cups.substring(2, 18))
  const calculatedRest = idNumber % 529

  const quotient = LETTERS[Math.floor(calculatedRest / 23)]
  const rest = LETTERS[calculatedRest % 23]

  return cups[18] === quotient && cups[19] === rest
}

export function validateSrNumber(sr: string): boolean {
  if (!/^[A-Z]{2}[-]{1}[0-9]{6}[-]{1}[A-Z]{1}[0-9]{9}$/.test(sr)) {
    return false
  } else {
    return true
  }
}

export function checkBrowser(): string {
  let ua = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i)
  let browser

  if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) {
    browser = 'msie'
  } else {
    browser = ua[1].toLowerCase()
  }

  return browser
}

export function validateCadastralReference(cadastral: string): boolean {
  let valid = false

  if (/^[a-zA-Z0-9]{20}$/.test(cadastral)) {
    valid = true
  }

  return valid
}

export function validateCadastralReferenceEmpty(cadastral: string): boolean {
  let valid = false

  if (/^[a-zA-Z0-9]{20}$/.test(cadastral) || cadastral == '') {
    valid = true
  }

  return valid
}

export function checkUserType(user: string): string {
  let type = '0'

  if (user.startsWith('X') || /^\d/.test(user)) {
    type = '0' // Persona física
  } else {
    type = '1' // Persona jurídica
  }

  return type
}

export function checkDocumentType(document: string): string {
  let type = '01'

  if (/^([0-9]){8}([A-Z]){1}$/.test(document)) {
    type = '01' // NIF
  } else if (/^([A-Z]){1}([0-9]){8}$/.test(document)) {
    type = '02' // CIF
  } else if (/^[a-z]{3}[0-9]{6}[a-z]?$/i.test(document)) {
    type = '03' // PASAPORTE
  } else if (/^([A-Z]){1}([0-9]){7}([A-Z]){1}$/.test(document)) {
    type = '04' // NIE
  }

  return type
}

export function checkDocumentTypeInString(document: string): string {
  let type = 'NIF'

  if (/^([0-9]){8}([A-Z]){1}$/.test(document)) {
    type = 'NIF'
  } else if (/^([A-Z]){1}([0-9]){8}$/.test(document)) {
    type = 'CIF'
  } else if (/^[a-z]{3}[0-9]{6}[a-z]?$/i.test(document)) {
    type = 'PASSPORT'
  } else if (/^([A-Z]){1}([0-9]){7}([A-Z]){1}$/.test(document)) {
    type = 'NIE'
  }

  return type
}

export function isPrevious2017(date: string): boolean {
  let isPrevious = false

  const year = date && parseInt(date.substring(0, 4))
  const month = date && parseInt(date.substring(4, 6))
  const day = date && parseInt(date.substring(6, 8))

  if (year && month && day) {
    const newDate = new Date(year, month - 1, day)

    // Fecha a comparar 1 de enero de 2017
    let dateToCompare = new Date(2017, 0, 1)

    if (newDate && dateToCompare && (newDate.getTime() < dateToCompare.getTime())) {
      isPrevious = true
    }
  }

  return isPrevious
}

export function validateDossierCode(code: string): boolean {
  let isValid = false

  if (code.startsWith('EXP') && code.length === 15) {
    isValid = true
  }

  return isValid
}

export function adminCheck(): boolean {
  let isAdmin = false

  const userRoles = sessionStorage.getItem('userRoles') || ''

  if (userRoles.includes('US_CC')) {
    isAdmin = true
  }

  return isAdmin
}

export function validateObjectEmpty(objeto: object): boolean {
  return Object.keys(objeto).filter((key) => objeto[key] === '').length > 0
}

export function validateJSON(str: string): boolean {
  if (typeof str !== 'string') return false

  try {
    const result = JSON.parse(str)

    const type = Object.prototype.toString.call(result)

    return type === '[object Object]' || type === '[object Array]'
  } catch (err) {
    return false
  }
}
