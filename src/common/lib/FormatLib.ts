import i18n from 'i18next'

export function formatCupsNumber(cups: string): string {
  const groups = [
    cups.substr(0, 2),
    cups.substr(2, 4),
    cups.substr(6, 4),
    cups.substr(10, 4),
    cups.substr(14, 4),
    cups.substr(18, 2),
    cups.substr(20, 2),
    cups.substr(22, cups.length)
  ]

  return groups.filter(Boolean).join(' ')
}

export function formatDate(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  return formattedDay + '/' + formattedMonth + '/' + year
}

// INPUT DATE
// OUTPUT STRING: ddmmyyyyhhmmss
export function formatDateAndHourString(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  let formattedHour = hour.toString()
  let formattedMinutes = minutes.toString()
  let formattedSeconds = seconds.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  formattedHour = hour < 10 ? '0' + hour : hour.toString()
  formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString()
  formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString()

  return formattedDay + formattedMonth + year + formattedHour + formattedMinutes + formattedSeconds
}

// INPUT DATE
// OUTPUT STRING: dd/mm/yyyy hh:mm:ss
export function formatDateAndHourStringWithBars(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  let formattedHour = hour.toString()
  let formattedMinutes = minutes.toString()
  let formattedSeconds = seconds.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  formattedHour = hour < 10 ? '0' + hour : hour.toString()
  formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString()
  formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString()

  return formattedDay + '/' + formattedMonth + '/' + year + ' ' + formattedHour + ':' + formattedMinutes + ':' + formattedSeconds
}

export function translateDocOfflineDates(dateAndHour: string, returnDate: boolean): string {
  const year = dateAndHour.substr(0, 4)
  const month = dateAndHour.substr(4, 2)
  const day = dateAndHour.substr(6, 2)
  const hour = dateAndHour.substr(8, 2)
  const minutes = dateAndHour.substr(10, 2)
  const seconds = dateAndHour.substr(12, 2)

  return returnDate ? day + '/' + month + '/' + year : hour + ':' + minutes + ':' + seconds
}

// yyyymmddhhmmss to yyyy-mm-dd hh:mm:ss
export function convertToFullDate(dateTime: string):string {

  const year = dateTime.slice(0, 4);
  const month = dateTime.slice(4, 6);
  const day = dateTime.slice(6, 8);
  const hour = dateTime.slice(8, 10);
  const minute = dateTime.slice(10, 12);
  const second = dateTime.slice(12, 14);

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hour}:${minute}:${second}`;

  return `${formattedDate} ${formattedTime}`;
}

// yyyymmddhhmmss to yyyy/mm/dd hh:mm:ss
export function formatDateAndTime(date) {
  if (date) {
    const year = date.substring(0, 4)
    const month = date.substring(4, 6)
    const day = date.substring(6, 8)
    const hour = date.substring(8, 10)
    const min = date.substring(10, 12)
    const sec = date.substring(12, 14)
    return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
  }
}

// INPUT STRING: yyyymmdd
// OUTPUT STRING: dd/mm/yyyy
export function formatDateString(stringDate: string): string {
  return stringDate.substr(6, 2) + '/' + stringDate.substr(4, 2) + '/' + stringDate.substr(0, 4)
}

// INPUT STRING: dd/mm/yyyy
// OUTPUT STRING: mm/dd/yyyy
export function formatUSADateString(stringDate: string): string {
  return stringDate.split('/')[1] + '/' + stringDate.split('/')[0] + '/' + stringDate.split('/')[2]
}

// INPUT STRING: hhmm
// OUTPUT STRING: hh:mm
export function formatTimeString(stringTime: string): string {
  return stringTime.substr(0, 2) + ':' + stringTime.substr(2, 2)
}

// INPUT STRING: yyyymmddhhmm
// OUTPUT STRING: dd/mm/yyyy hh:mm
export function formatCompletDateString(stringDate: string): string {
  return stringDate.substr(6, 2) + '/' + stringDate.substr(4, 2) + '/' + stringDate.substr(0, 4) + ' ' + stringDate.substr(8, 2) + ':' + stringDate.substr(10, 2)
}

// INPUT STRING: dd/mm/yyyy hh:mm:ss
// OUTPUT STRING: dd/mm/yyyy
export function extractDateFromDateAndHourString(stringDateAndHour: string): string {
  return stringDateAndHour.substr(0, 10)
}

// INPUT STRING: dd/mm/yyyy hh:mm:ss
// OUTPUT STRING: hh:mm
export function extractHourFromDateAndHourString(stringDateAndHour: string): string {
  return stringDateAndHour.substr(11, 5)
}

export function formatDateZeus(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  return year + formattedMonth + formattedDay;
}

export function formatDateAndHourZeus(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  let formattedHour = hour.toString()
  let formattedMinutes = minutes.toString()
  let formattedSeconds = seconds.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  formattedHour = hour < 10 ? '0' + hour : hour.toString()
  formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString()
  formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString()

  return year + formattedMonth + formattedDay + formattedHour + formattedMinutes + formattedSeconds;
}

export function formatDateBars(date: any): string {
  const auxDate = date.toString().split('-')

  return auxDate[2] + '/' + auxDate[1] + '/' + auxDate[0]
}

export function formatDateHyphens(date: any): string {
  const auxDate = date.toString().split('/')

  return auxDate[2] + '-' + auxDate[1] + '-' + auxDate[0]
}

export function formatMonthAndYear(date: string): string {
  const auxDate = date.split('/')

  return formatMonth(auxDate[1]) + ' ' + auxDate[2]
}

export function formatDayAndMonthToDate(date: string): Date {
  const auxDate = date.split('/')
  const parsedDate = `${auxDate[1]}/${auxDate[0]}/${auxDate[2]}`
  return new Date(parsedDate)
}

export function formatHour(hour: any): string {
  if (hour < 10) {
    hour= '0' + hour
  }

  return hour + ':00'
} 

export function formatQuarterHour(hour: any, quarter: any): string {
  if (hour < 10) {
    hour= '0' + hour
  }

  return hour + quarter
} 

export function formatDay(date: string): string {
  return date.substr(0, date.indexOf('/'))
}

export function formatMonth(month: string): string {
  const months = [
    i18n.t('common.months.january'),
    i18n.t('common.months.february'),
    i18n.t('common.months.march'),
    i18n.t('common.months.april'),
    i18n.t('common.months.may'),
    i18n.t('common.months.june'),
    i18n.t('common.months.july'),
    i18n.t('common.months.agost'),
    i18n.t('common.months.september'),
    i18n.t('common.months.october'),
    i18n.t('common.months.november'),
    i18n.t('common.months.december')
  ]

  return months[Number(month) - 1]
}

export function formatDayAndMonthAndYear(date: string): string {
  const auxDate = date.split('/')

  return auxDate[0] + i18n.t('common.preposicions.of') + formatMonth(auxDate[1]) + i18n.t('common.preposicions.of') + auxDate[2]
}

export function fixNifLength(nif: string): string {
  let formattedNif = nif

  if (nif.length < 9) {
    for (let i = 0; i < 9 - nif.length; i++) {
      formattedNif = '0' + formattedNif
    }
  }

  return formattedNif
}

export function generateRandomString(length: number): string {
  let result = ''

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function generateRandomNumberString(length: number): string {
  let result = ''

  const characters = '0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function fixIneCodeTownLength(ineCode: string): string {
  let formattedIneCode = ineCode

  if (ineCode.length < 3) {
    for (let i = 0; i < 3 - ineCode.length; i++) {
      formattedIneCode = '0' + formattedIneCode
    }
  }

  return formattedIneCode
}

export function getTracksTypes(): any {
  const types = [
    'LUGAR|' + i18n.t('common.tracksTypes.place'),
    'AVDA|' + i18n.t('common.tracksTypes.avenue'),
    'BULEV|' + i18n.t('common.tracksTypes.boulevard'),
    'CALLE|' + i18n.t('common.tracksTypes.street'),
    'CMNO|' + i18n.t('common.tracksTypes.path'),
    'CRTA|' + i18n.t('common.tracksTypes.highway'),
    'PASEO|' + i18n.t('common.tracksTypes.walk'),
    'PAU|' + i18n.t('common.tracksTypes.pau'),
    'PLAZA|' + i18n.t('common.tracksTypes.square'),
    'POLIG|' + i18n.t('common.tracksTypes.polygon'),
    'PSAJE|' + i18n.t('common.tracksTypes.passage'),
    'SENDA|' + i18n.t('common.tracksTypes.track'),
    'VIA|' + i18n.t('common.tracksTypes.via')
  ]

  return types
}

export function noAccents(str: string): string {
  return str.normalize('NFD')
    .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, '$1')
    .normalize()
}

export function getInternationalMonth(month: string): string {
  let monthAux: string
  switch (month) {
    case '01':
      monthAux = i18n.t('common.months.january')
      break
    case '02':
      monthAux = i18n.t('common.months.february')
      break
    case '03':
      monthAux = i18n.t('common.months.march')
      break
    case '04':
      monthAux = i18n.t('common.months.april')
      break
    case '05':
      monthAux = i18n.t('common.months.may')
      break
    case '06':
      monthAux = i18n.t('common.months.june')
      break
    case '07':
      monthAux = i18n.t('common.months.july')
      break
    case '08':
      monthAux = i18n.t('common.months.agost')
      break
    case '09':
      monthAux = i18n.t('common.months.september')
      break
    case '10':
      monthAux = i18n.t('common.months.october')
      break
    case '11':
      monthAux = i18n.t('common.months.november')
      break
    case '12':
      monthAux = i18n.t('common.months.december')
      break
  }

  return monthAux
}

export function gettHourFromDate(date: any): string {
  let hour = date.getHours(), minutes = date.getMinutes()
  if(hour < 10){
    hour = '0' + hour
  }
  if(minutes === 0){
    minutes = '0' + minutes
  }
  return hour + ':' + minutes
}

export function convertStringToDateHours(time: string): Date {
  const today = new Date()
  const hours = time.split(':')[0]
  const minutes = time.split(':')[1]
  return new Date(today.getFullYear(), today.getMonth() + 1, today.getDate(), hours && parseInt(hours), minutes && parseInt(minutes), 0, 0)
}

// INPUT STRING: yyyymmddhhmmss
// OUTPUT DATE
export function completeDate (date: string): Date {
  const year = parseInt(date.substr(0, 4))
  const month = parseInt(date.substr(4, 2))
  const day = parseInt(date.substr(6, 2))
  const hours = parseInt(date.substr(8, 2))
  const minutes = parseInt(date.substr(10, 2))
  const seconds = parseInt(date.substr(12, 2))

  return new Date(year, month - 1, day, hours, minutes, seconds)
}

// INPUT STRING: dd/mm/yyyy hh:mm:ss
// OUTPUT DATE
export function completeDateWithSlash (date: string): Date {
  const day = parseInt(date.substring(0, 2));
  const month = parseInt(date.substring(3, 5));
  const year = parseInt(date.substring(6, 10));
  const hours = parseInt(date.substring(11, 13));
  const minutes = parseInt(date.substring(14, 16));
  const seconds = parseInt(date.substring(17, 19));

  return new Date(year, month - 1, day, hours, minutes, seconds);
}


export function completeDateWithSlashNoHour (date: string): Date {
  const day = parseInt(date.substring(0, 2));
  const month = parseInt(date.substring(3, 5));
  const year = parseInt(date.substring(6, 10));

  return new Date(year, month - 1, day);
}

/* Calculo de un año posterior a la fecha incial en formato string */
export function getOneYearFromDate(beginDate: string): Date {
  const parsedDateArray = beginDate.split('/')
  const parsedDate = `${parsedDateArray[1]}/${parsedDateArray[0]}/${parsedDateArray[2]}`
  const oneYearFromDate = new Date(parsedDate)
  oneYearFromDate.setMonth(oneYearFromDate.getMonth() + 12)
  return oneYearFromDate
}

export function getOneMonthFromDate(beginDate: string): Date {
  const parsedDateArray = beginDate.split('/')
  const parsedDate = `${parsedDateArray[1]}/${parsedDateArray[0]}/${parsedDateArray[2]}`
  const oneMonthFromDate = new Date(parsedDate)
  oneMonthFromDate.setMonth(oneMonthFromDate.getMonth() + 1)
  return oneMonthFromDate
}

export function getOneWeekFromDate(beginDate: string): Date {
  const parsedDateArray = beginDate.split('/')
  const parsedDate = `${parsedDateArray[1]}/${parsedDateArray[0]}/${parsedDateArray[2]}`
  const oneWeekFromDate = new Date(parsedDate)
  oneWeekFromDate.setDate(oneWeekFromDate.getDate()+ 7);
  return oneWeekFromDate
}

export function getSixDaysFromDate(beginDate: string): Date {
  const parsedDateArray = beginDate.split('/')
  const parsedDate = `${parsedDateArray[1]}/${parsedDateArray[0]}/${parsedDateArray[2]}`
  const oneWeekFromDate = new Date(parsedDate)
  oneWeekFromDate.setDate(oneWeekFromDate.getDate()+ 6);
  return oneWeekFromDate
}

export function formatDateWarnings(date: Date): string {
  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  let formattedDay = day.toString()
  let formattedMonth = month.toString()

  if (day < 10) {
    formattedDay = '0' + day
  }

  if (month < 10) {
    formattedMonth = '0' + month
  }

  return year + '-' + formattedMonth + '-' + formattedDay;
}

 export function formatWebStartDate(dateString) {
  const dateArray = dateString.split(' ')[0].split('/');
  const timeArray = dateString.split(' ')[1].split(':');
  const year = dateArray[2];
  const month = ('0' + dateArray[1]).slice(-2);
  const day = ('0' + dateArray[0]).slice(-2);
  const hour = ('0' + timeArray[0]).slice(-2);
  const minute = ('0' + timeArray[1]).slice(-2);
  const second = ('0' + timeArray[2]).slice(-2);
  return year + month + day + hour + minute + second;
}


export function formatWebStartDateNoSeconds(dateString) {
  const dateArray = dateString.split(' ')[0].split('/');
  const timeArray = dateString.split(' ')[1].split(':');
  const year = dateArray[2];
  const month = ('0' + dateArray[1]).slice(-2);
  const day = ('0' + dateArray[0]).slice(-2);
  const hour = ('0' + timeArray[0]).slice(-2);
  const minute = ('0' + timeArray[1]).slice(-2);
  return year + month + day + hour + minute;
}

export function actualLocalDate() {

  let fecha = new Date();
  let año = fecha.getFullYear();
  let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  let dia = ('0' + fecha.getDate()).slice(-2);
  let hora = ('0' + fecha.getHours()).slice(-2);
  let minuto = ('0' + fecha.getMinutes()).slice(-2);
  let segundo = ('0' + fecha.getSeconds()).slice(-2);

  return  `${año}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

}

export function formatIsoDate(isoString) {
  // Crea un nuevo objeto de fecha a partir de la cadena ISO
  const date = new Date(isoString);
  
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();

  
  return `${day}/${month}/${year}`;
}

export function formatIsoDateAndHour(isoString) { 
  // Crea un nuevo objeto de fecha a partir de la cadena ISO
  const date = new Date(isoString);
  
  // Extraer día, mes y año
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const year = date.getFullYear();

  // Extraer horas, minutos y segundos
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Devolver fecha y hora formateada
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}


export function capitalizeFirstLetter(str) {
  if (str.length === 0) return str; // Maneja cadenas vacías
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



export const formatNumber = (number) => {

  if (!number || typeof number !== 'string' || isNaN(Number(number.replace(',', '.')))) {
    return 'No disponible'; // Devolver una cadena vacía si la entrada no es válida
  }

  // Dividir el número entre mil y convertirlo a cadena con 2 decimales asegurados
  const dividedByThousand = (Number(number.replace(',', '.')) / 1000).toFixed(2);

  // Convertir a cadena y dividir en parte entera y decimal
  const [integerPart, decimalPart] = dividedByThousand.split('.');
  // Formatear la parte entera con separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  // Concatenar la parte decimal
  return `${formattedInteger},${decimalPart}`;
};
