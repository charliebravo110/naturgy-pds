import i18next from 'i18next'

const I18N_BACKEND_TYPE = 'backend'

const LOCALES_PATH = './assets/locales/'

/**
 * Backend de i18n para realizar la carga de los ficheros de traducción en SPARQ.
 */
class I18nBackend {
  static type: string = I18N_BACKEND_TYPE

  private services: i18next.Services
  private options: i18next.InitOptions
  private path: string = ''

  /**
   * Inicializa el backend para el módulo de i18next y establece el tipo de backedn de i18next.
   *
   * @param services: plugin de i18next servicios de internacionalización
   * @param options: opciones de inicialización
   */
  constructor(services: i18next.Services, options: i18next.InitOptions) {
    this.services = services
    this.options = options
    this.path = `${LOCALES_PATH}{{lng}}`
  }

  /**
   * Inicializa el backend para el módulo de i18next, con las opciones de configuración y los servicios especificados.
   *
   * @param services: plugin de i18next servicios de internacionalización
   * @param options: opciones de inicialización
   */
  init(services: i18next.Services, options: i18next.InitOptions) {
    this.services = services
    this.options = options
  }

  /**
   * Obtiene el path del fichero de traducciones dependiendo del lenguaje.
   *
   * @param {string} language identificador del lenguaje a importar
   * @param {string} namespace espacio de nombres asociado al fichero importado
   * @returns {string} path del fichero de traducciones
   * @private
   */
  _getLocaleFilePath(language: string): string {
    return this.services.interpolator.interpolate(this.path, { lng: language }, '', {})
  }

  /**
   * Importa un fichero de traducciones y ejecuta el callback especificado al que se lo pasa por parámetro.
   *
   * @param {string} language: identificador del lenguaje a importar
   * @param {string} namespace: espacio de nombres asociado al fichero importado
   * @param {function} callback: callback a ejecutar una vez se ha importado el fichero de traducciones
   */
  async read(language: string, namespace: string, callback: any) {
    const filePath = this._getLocaleFilePath(language)

    const lang = await import(`${filePath}.json`)

    callback(null, { ...lang })
  }
}

export default I18nBackend