import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

//import I18nBackend from '../I18nBackend'
import Backend from 'i18next-http-backend'

const lang = sessionStorage.getItem('lang')

i18n.use(Backend).use(initReactI18next).init({
  lng: lang ? lang : 'es',
  fallbackLng: lang ? lang : 'es',
  whitelist: ['es', 'en', 'gl'],
  load:'languageOnly',
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: '../../../../locales/{{lng}}.json'
  },
  react: {
    useSuspense: true
  }
})
