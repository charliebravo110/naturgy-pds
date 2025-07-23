// LCS: Función para enviar eventos a Google Tag Manager (GTM). - Wave 1
export const sendGAEvent = (eventData) => {
    // LCS: Inicializa el dataLayer si no existe, creando un array vacío. - Wave 1
    window.dataLayer = window.dataLayer || [];
    
    // LCS: Envía el evento proporcionado al dataLayer de GTM. - Wave 1
    window.dataLayer.push(eventData);
};

// LCS: obtenemos el tipo de navegación - Wave 2
export const getBrowsing_type = () => {
  let browsing_type = 'desktop'; // Valor por defecto

  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /android|iphone|ipad|ipod|windows phone/.test(userAgent);
  const hasTouchScreen = (() => {
      return (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
      );
  })();

  // Detecta si está dentro de una WebView (Flutter, iOS, Android)
  const isInWebView =
      (/(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(userAgent)) ||
      (userAgent.includes('wv') || (userAgent.includes('version/') && !userAgent.includes('chrome'))) ||
      userAgent.includes('flutter');

  // PWA (Progressive Web App en modo standalone)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const isEmulator = userAgent.includes('emulator');

  // Detecta si se está utilizando el inspector de elementos
  const isInspector = window.outerWidth < 768 || window.outerHeight < 600;
  console.log('isInspector:', isInspector);

  // Detecta si se está utilizando el toggle device toolbar
  const isDeviceToolbar = navigator.userAgent.includes('HeadlessChrome') || navigator.userAgent.includes('Chrome-Lighthouse');

  if ((isMobileUserAgent && hasTouchScreen) && (isInWebView || isStandalone) && !isInspector) {
      browsing_type = 'app'; // App móvil (WebView, Flutter, o PWA)
  } else if (isMobileUserAgent && hasTouchScreen && !isDeviceToolbar && !isInspector) {
      browsing_type = 'web'; // Navegador móvil
  } else if (isDeviceToolbar || isInspector || isEmulator) {
      browsing_type = 'web'; // Escritorio real o inspector de elementos
  } else {
      browsing_type = 'web'; // Escritorio real
  }

  sessionStorage.setItem('browsing_type', browsing_type);
};

// LCS: comprobamos el rol del usuario - Wave 2
export const getUser_type = () => {    
    let user_type = ''
    let userDocument = sessionStorage.getItem('userDocument')
    /*
    Rol Nif/Nie -> Letra al principio o al final
    Rol 700 -> Empieza con 709
    Rol 900/uf -> Empieza con 900 o con uf
    Rol 990 -> Empieza con 990
    */
    if (userDocument.startsWith("7092") && /^\d+$/.test(userDocument) || userDocument.startsWith("7093") && /^\d+$/.test(userDocument)) {
        // Rol 700: Empieza con 709
        user_type = '700';
    } else if (userDocument.startsWith("uf") || userDocument.startsWith("90") && /^\d+$/.test(userDocument)) {
        // Rol 900/uf: Empieza con 900 o con uf
        user_type = '900';
    } else if (userDocument.startsWith("990") && /^\d+$/.test(userDocument)) {
        // Rol 990: Empieza con 990
        user_type = '990';
    } else {
        user_type = 'nif';
    }
    /*
    else if ((/^[A-Z]\d{8}[A-Z]$/.test(userDocument)) || (/^[XYZ]\d{7}[A-Z]$/.test(userDocument))) {
        // Comprobación para NIE: empieza con X, Y o Z seguido de 7 dígitos y una letra
        user_type = 'nif';
        //user_type = 'nif/nie';
    }*/
    sessionStorage.setItem('user_type', user_type)
}

// LCS: guardamos en la sessionStorage el clientID de GA - Wave 2
export  const getGAClientId = () =>{
  const cookie = document.cookie
  .split('; ')
  .find(row => row.startsWith('_ga='));

  let ga_client_id

  if (cookie) {
    ga_client_id = cookie.split('=')[1];
    if(ga_client_id === null)
      ga_client_id = 'no aplica'
    sessionStorage.setItem('ga_client_id',ga_client_id)
  } else {
    ga_client_id = 'no aplica'
  }
}

// LCS: Función para mapear la tipologia de los dossiers - Wave 3
export const getTypologySelfConsumption = (selectedTypology) => {
    let auxTypology
    switch(selectedTypology){
        case 'DOSSUB016':
          auxTypology = "hidraulica"
          break;
        case 'DOSSUB017':
          auxTypology = "fotovoltaica"
          break;
        case 'DOSSUB028':
          auxTypology = "acumulacion"
          break;
        case 'DOSSUB018':
          auxTypology = "eolica"
          break;
        case 'DOSSUB019':
          auxTypology = "solar termica"
          break;
        case 'DOSSUB020':
          auxTypology = "cogeneracion"
          break;
        case 'DOSSUB021':
          auxTypology = "biomasa"
          break;
        case 'DOSSUB022':
          auxTypology = "biogas"
          break;
        case 'DOSSUB023':
          auxTypology = "residuos"
          break;
        case 'DOSSUB024':
          auxTypology = "otras generacion"
          break;
        case 'DOSSUB025':
          auxTypology = "modificación definitiva de instalaciones"
          break;
        case 'DOSSUB027':
          auxTypology = "telecomunicaciones"
          break;
        default:
          auxTypology = 'no aplica'
          break;
    }
    return auxTypology
}

// LCS: Función para mapear los códigos de estado de los expedientes - Wave 3
export const getExpStatus = (code) => {
switch (code) {
  case 'STATUS0006':
    return 'valido';
  case 'STATUS0098':
    return 'cancelado';
  case 'STATUS0099':
    return 'cerrado';
  case 'STATUS0010':
    return 'abierto';
  case 'STATUS0004':
    return 'anulado';
  case 'STATUS0001':
    return 'alta';
  case 'STATUS0003':
    return 'pediente documentacion';
  case 'STATUS0012':
    return 'presupuestado';
  case 'STATUS0014':
    return 'valorado';
  case 'STATUS0040':
    return 'cobrado';
  case 'STATUS0072':
    return 'en ejecucion';
  case 'STATUS0078':
    return 'en disposicion de servicio'
  case 'STATUS0096':
    return 'fuera de plazo';
  case 'STATUS0094':
    return 'denegado';
  case 'STATUS0100':
    return 'pendiente revision';
  case 'STATUS101':
    return 'pendiente subsanacion';
  case 'STATUS0102':
    return 'inadmitido';
  default:
    return code;
}
}

// LCS: funcion que quita acentos - Wave 3
export const removeAccents = (str) => {
  return str
      .normalize("NFD") // Normaliza el string
      .replace(/[\u0300-\u036f]/g, ""); // Elimina los acentos
}

// LCS: eliminar email del path
export const removeEmails = ( path ) => {

  //const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailPattern = /\/[a-f0-9-]{36}\/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Comprobar si hay correos electrónicos en el path
  if (emailPattern.test(path)) {
    // Si hay, eliminar los correos electrónicos
    return path.replace(emailPattern, '');
  }

  // Si no hay correos electrónicos, devolver el path original
  return path;
};

// LCS: función para ocultar caracteres de los CUPS - Wave 3
export const hideCUPS = (cups) => {

  const ocultarInicio = '*'.repeat(11);
  const parteCentral = cups.slice(11, -4);
  const ocultarFinal = '*'.repeat(2);

  return ocultarInicio + parteCentral + ocultarFinal;
}

// LCS: función para modificar filtros de apiUrl ocultando datos personales - Wave 3
export const modApiUrl = (filter) => {

  var modText = filter

  if (filter.includes('documentNumber::')) {
    modText = modText.replace(/\s*documentNumber::[^|]*/g, 'user_id::' + sessionStorage.getItem('id'));
  }

  if (filter.includes('cups::')) {
    modText = modText.replace(/\s*cups::[^|]*/g, 'cups::' + hideCUPS(modText.match(/cups::([^|]+)/)[1]));
  }

  if (filter.includes('applicantNif::')) {
    modText = modText.replace(/\s*applicantNif::[^|]*/g, '');
  }
  
  return modText;
}